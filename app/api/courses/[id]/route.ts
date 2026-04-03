import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    await dbConnect();
    
    const course = await Course.findById(id).populate("teacher", "name email");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseObj = course.toObject();
    const isEnrolled = session?.user?.id 
      ? courseObj.enrolledStudents.some((studentId: any) => studentId.toString() === session.user.id)
      : false;
    
    delete courseObj.enrolledStudents; 
    return NextResponse.json({ ...courseObj, isEnrolled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
