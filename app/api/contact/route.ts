import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, course, message } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { message: "Name, phone, and email are required fields." },
        { status: 400 }
      );
    }

    const result = await sendMail({ name, phone, email, course, message });

    if (result.success) {
      return NextResponse.json(
        { message: "Inquiry sent successfully!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to send inquiry. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error occurred while sending the email." },
      { status: 500 }
    );
  }
}
