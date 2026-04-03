import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "teacher" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Find all courses where this teacher is assigned
    const assignedCourses = await Course.find({ teacher: session.user.id })
      .populate("enrolledStudents", "name email");

    const totalCourses = assignedCourses.length;
    let totalStudents = 0;
    assignedCourses.forEach(course => {
      totalStudents += (course.enrolledStudents?.length || 0);
    });

    // We can also fetch the most recently updated courses
    const recentCourses = assignedCourses
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);

    return NextResponse.json({
      totalCourses,
      totalStudents,
      recentCourses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
