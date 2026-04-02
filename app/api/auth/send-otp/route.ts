import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { generateOtp, sendOtpEmail } from "@/lib/sendOtp";

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user exists (for login type)
    const user = await User.findOne({ email });
    
    if (type === "login" && !user) {
      return NextResponse.json({ message: "User not found. Please sign up first." }, { status: 404 });
    }

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (user) {
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // For signup, we don't create the user yet, or we create a temporary one.
      // Better: Store OTP in a temporary way or just send it and verify on signup.
      // For now, I'll allow signup to proceed if they have the OTP.
      // I'll create a "placeholder" user for signup if it doesn't exist, to store the OTP.
      await User.findOneAndUpdate(
        { email },
        { otp, otpExpires, role: "student" }, // Default role for temp user
        { upsert: true, new: true }
      );
    }

    const emailSent = await sendOtpEmail(email, otp);

    if (!emailSent.success) {
      return NextResponse.json({ message: "Failed to send OTP email" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
