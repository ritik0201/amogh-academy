import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find all courses where this student is enrolled
    const enrolledCourses = await Course.find({ enrolledStudents: session.user.id })
      .populate("teacher", "name");

    const totalCourses = enrolledCourses.length;

    // Fetch the 3 most recent courses they are enrolled in
    const recentCourses = enrolledCourses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return NextResponse.json({
      totalCourses,
      recentCourses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
