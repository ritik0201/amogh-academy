import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      courseId 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RP_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Success! Enroll student
    await dbConnect();
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: session.user.id },
    });

    return NextResponse.json({ message: "Enrolled successfully" });
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
