import connectDB from "@/lib/db";
import { LoginSchema } from "@/schema/LoginSchema";
import { z } from "zod";
import { response } from "@/lib/helperFunction";
import User from "@/models/user.model";
import { SignJWT } from "jose";
import { sendMail, emailVerificationLink } from "@/lib/mailer";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const validationSchema = LoginSchema.pick({
      email: true,
    }).extend({
      password: z.string(),
    });

    const validatedData = validationSchema.safeParse(data);
    if (!validatedData.success) {
      return response(false, 402, "Validation Failed");
    }

    const { email, password } = validatedData.data;

    const getUser = await User.findOne({ email });
    if (!getUser) {
      return response(false, 402, "User not Found");
    }

    // Email verification before login
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);

      await sendMail(
        "Email Verification Request from SuryaExportAndImport",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        )
      );

      return response(
        false,
        401,
        "Email not verified. Verification email sent."
      );
    }

    // Password check
    const isVerified = await getUser.verifyPassword(password);
    if (!isVerified) {
      return response(false, 403, "Invalid Login Credentials");
    }

    // Generate JWT for login
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const loginToken = await new SignJWT({ userId: getUser._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return response(true, 200, "Login successful", { token: loginToken });
  } catch (error) {
    console.error("Login error:", error);
    return response(false, 500, error.message || "Something went wrong");
  }
}
