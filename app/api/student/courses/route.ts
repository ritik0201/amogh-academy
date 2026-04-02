import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import "@/models/lecture"; // Ensure Lecture model is registered for population

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const courses = await Course.find({
      enrolledStudents: session.user.id
    })
    .populate("teacher", "name")
    .populate("lectures");

    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
