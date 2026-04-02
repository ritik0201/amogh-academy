import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lecture from "@/models/lecture";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    await dbConnect();
    const lectures = await Lecture.find({ course: courseId }).sort({ createdAt: 1 });
    return NextResponse.json(lectures);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "teacher" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, youtubeUrl, courseId, isLive } = await req.json();

    if (!title || !youtubeUrl || !courseId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    
    // Create the lecture
    const lecture = await Lecture.create({
      title,
      description,
      youtubeUrl,
      isLive: isLive || false,
      course: courseId,
    });

    // Update the course's lectures array
    await Course.findByIdAndUpdate(courseId, {
      $push: { lectures: lecture._id },
    });

    return NextResponse.json(lecture, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
