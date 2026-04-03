import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [totalStudents, totalTeachers, totalCourses, courses] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Course.countDocuments({}),
      Course.find({}, "price enrolledStudents")
    ]);

    // Calculate total revenue
    const totalRevenue = courses.reduce((acc, course) => {
      return acc + (course.price * (course.enrolledStudents?.length || 0));
    }, 0);

    // Fetch recent signups for logs
    const recentUsers = await User.find({}, "name role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalRevenue,
      recentUsers
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
