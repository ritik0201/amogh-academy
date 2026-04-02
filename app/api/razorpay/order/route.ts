import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RP_KEY_ID || "",
  key_secret: process.env.RP_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, courseId } = await req.json();

    if (!amount || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${courseId.slice(-8)}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}