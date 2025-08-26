import connectDB from "@/lib/db";
import { jwtVerify } from "jose";
import { catchError, response } from "@/lib/helperFunction";
import User from "@/models/user.model";

export async function POST(request) {
  try {
    await connectDB();
    const { token } = await request.json();

    if (!token) {
      return response(false, 400, "Missing token");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    let decoded;
    try {
      decoded = await jwtVerify(token, secret);
    } catch (err) {
      return response(false, 401, "Invalid or expired token");
    }

    const userId = decoded.payload.userId;

    const user = await User.findById(userId);
    if (!user) {
      return response(false, 404, "User not found");
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "User email verified successfully");
  } catch (error) {
    return catchError(error);
  }
}
