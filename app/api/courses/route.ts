import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({})
      .populate("teacher", "name email")
      .select("-enrolledStudents"); // Don't leak student IDs to public
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
