"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

import verifiedImg from "@/public/assets/images/verified.gif";
import verifiedFaild from "@/public/assets/images/verification-failed.gif";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EmailVerify = ({ params }) => {
  const [isVerify, setIsVerify] = useState(null); // null = loading, true = success, false = fail
  const { token } = params;

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });
        if (data.success) {
          setIsVerify(true);
        } else {
          setIsVerify(false);
        }
      } catch (err) {
        setIsVerify(false);
      }
    };
    verify();
  }, [token]);

  return (
    <Card className="flex justify-center items-center p-4 shadow-lg">
      <CardContent className="w-[400px] flex justify-center items-center">
        {isVerify === null && (
          <p className="text-center">Verifying your email...</p>
        )}

        {isVerify === true && (
          <div className="text-center">
            <Image src={verifiedImg} alt="Verified" width={300} height={300} />
            <p className="mt-4 text-green-600 font-semibold">
              Your email has been verified successfully!
            </p>

            <div>
              <Button asChild>
                <Link  href={'/auth/login/'}> Continue Shopping</Link>
              </Button>
            </div>
          </div>

  
        )}

        {isVerify === false && (
          <div className="text-center">
            <Image src={verifiedFaild} alt="Verification failed" width={300} height={300} />
            <p className="mt-4 text-red-600 font-semibold">
              Verification failed. The link may have expired.
            </p>

            <div>
              <Button asChild>
                <Link  href={'/auth/login/'}> Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerify;
