import { NextResponse } from "next/server";

// ✅ Consistent API response
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  }, { status: statusCode });
};

// ✅ Centralized error handler
export const catchError = (error, customMessage) => {
  // Handle duplicate key error from MongoDB
  if (error.code === 11000) {
    const keys = Object.keys(error.keyPattern).join(", ");
    error.message = `Duplicate field: ${keys}. These field values must be unique.`;
  }

  let message = error.message || "Internal Server Error";
  let data = {};

  if (process.env.NODE_ENV === "development") {
    data = { error }; // full error object for debugging
  }

  return response(false, error.statusCode || 500, customMessage || message, data);
};
