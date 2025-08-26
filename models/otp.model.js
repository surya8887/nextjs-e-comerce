import mongoose from "mongoose";
import { required } from "zod/v4/core/util";

const optSchema = new mongoose.Schema(
  {
    email:{
        type: String,
        required:true,
    }
  },
  {
    timestamps: true,
  }
);
