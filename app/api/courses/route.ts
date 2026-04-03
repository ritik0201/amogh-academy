import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    const courses = await Course.find({})
      .populate("teacher", "name email");

    const coursesWithEnrollment = courses.map((course: any) => {
      const courseObj = course.toObject();
      const isEnrolled = session?.user?.id 
        ? courseObj.enrolledStudents.some((id: any) => id.toString() === session.user.id)
        : false;
      
      delete courseObj.enrolledStudents; // Don't leak student IDs
      return {
        ...courseObj,
        isEnrolled
      };
    });

    return NextResponse.json(coursesWithEnrollment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
