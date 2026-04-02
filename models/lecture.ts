// models/Lecture.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILecture extends Document {
  title: string;
  description?: string;
  youtubeUrl: string;
  isLive: boolean;
  course: Types.ObjectId;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

const LectureSchema: Schema<ILecture> = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  youtubeUrl: {
    type: String,
    required: true,
  },

  isLive: {
    type: Boolean,
    default: false,
  },

  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },

  startedAt: Date,

  endedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Lecture ||
  mongoose.model<ILecture>("Lecture", LectureSchema);