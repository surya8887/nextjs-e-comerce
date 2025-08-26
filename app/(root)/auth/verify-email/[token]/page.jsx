"use client";
import React, { useEffect, useState, use } from "react"; // ⬅️ added `use`

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import verifiedImg from "@/public/assets/images/verified.gif";
import verifiedFaild from "@/public/assets/images/verification-failed.gif";

const EmailVerify = ({ params }) => {
  const { token } = use(params); // ⬅️ unwrap params with React.use()
  const [isVerify, setIsVerify] = useState(null); // null = loading, true = success, false = fail

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        setIsVerify(data.success);
      } catch (err) {
        setIsVerify(false);
      }
    };
    verify();
  }, [token]);

  return (
    <Card className="flex justify-center items-center p-4 shadow-lg">
      <CardContent className="w-[400px] flex flex-col justify-center items-center">
        {isVerify === null && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-center mt-3">Verifying your email...</p>
          </div>
        )}

        {isVerify === true && (
          <div className="text-center">
            <Image src={verifiedImg} alt="Verified" width={300} height={300} />
            <p className="mt-4 text-green-600 font-semibold">
              Your email has been verified successfully!
            </p>
            <Button asChild className="mt-4">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </div>
        )}

        {isVerify === false && (
          <div className="text-center">
            <Image src={verifiedFaild} alt="Verification failed" width={300} height={300} />
            <p className="mt-4 text-red-600 font-semibold">
              Verification failed. The link may have expired.
            </p>
            <Button asChild className="mt-4">
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerify;
