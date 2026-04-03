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

    // Find all courses assigned to this teacher
    const courses = await Course.find({ teacher: session.user.id })
      .populate("enrolledStudents", "name email phone createdAt");

    // Flatten and unique students
    const studentMap = new Map();

    courses.forEach(course => {
      course.enrolledStudents.forEach((student: any) => {
        if (!studentMap.has(student._id.toString())) {
          studentMap.set(student._id.toString(), {
            _id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            createdAt: student.createdAt,
            courses: [] // Tracking which courses they are in
          });
        }
        studentMap.get(student._id.toString()).courses.push({
          _id: course._id,
          title: course.title
        });
      });
    });

    const students = Array.from(studentMap.values());

    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
