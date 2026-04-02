// models/Course.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  enrolledStudents: Types.ObjectId[];
  teacher: Types.ObjectId;
  lectures: Types.ObjectId[];
  createdAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  thumbnail: String,

  price: {
    type: Number,
    default: 5,
  },

  enrolledStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  lectures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);