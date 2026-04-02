import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";

export async function POST(req: Request) {
  try {
    const { name, email, otp, role, grade, subject, experience } = await req.json();

    if (!name || !email || !otp || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the user (holding the OTP)
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Role-specific field additions
    user.name = name;
    user.role = role.toLowerCase();
    user.grade = grade;
    user.subject = subject;
    user.experience = experience;
    
    // Clear OTP and activate user
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;

    await user.save();

    return NextResponse.json(
      { message: "User created successfully", user: { name: user.name, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
