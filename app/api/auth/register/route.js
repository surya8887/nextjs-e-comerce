import connectDB from "@/lib/db";
import { RegisterSchema } from "@/app/schema/RegisterSchema";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/sendMail";
import { emailVerificationLink } from "@/email/emailVerificationLink";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = RegisterSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validationData = validationSchema.safeParse(payload);

    if (!validationData.success) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Validation failed",
          errors: validationData.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationData.data;

    // ✅ Check if user exists
    const existUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existUser) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 409,
          message: "User already registered",
        },
        { status: 409 }
      );
    }


    // ✅ Save user
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // ✅ Create JWT with `jose`
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: newUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h") // expires in 1 hour
      .sign(secret);

      await sendMail('Email Verification Request from SuryaExportAndImport',email,emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "User registered successfully",
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          token, // ✅ send token back
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
