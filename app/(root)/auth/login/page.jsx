"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema } from "@/schema/LoginSchema"
import { ButtonLoading } from "@/components/CustomUI/ButtonLoading"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import Logo from "@/public/assets/images/logo-black.png"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values) {
    try {
      setLoading(true)
      console.log("Login data:", values)

      // 👉 Here you can call your API (e.g., FastAPI backend)
      // const response = await fetch("/api/login", { ... })

      // Simulating delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px] shadow-lg border border-gray-200">
        <CardHeader className="flex flex-col items-center space-y-1">
          <Image
            src={Logo}
            alt="Company logo"
            width={140}
            height={60}
            priority
          />
          <h1 className="text-2xl font-bold text-center">
            Login to Your Account
          </h1>
          <p className="text-sm font-medium text-gray-500 text-center">
            Please enter your credentials to continue
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <ButtonLoading
                type="submit"
                text="Login"
                loading={loading}
                className="w-full"
              />
            </form>
          </Form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
