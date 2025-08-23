"use client"

import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ButtonLoading({
  type = "button",
  loading = false,
  disabled = false,
  text,
  onClick,
  className,
  ...props
}) {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      aria-busy={loading}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && (
        <Loader2Icon
          className="h-4 w-4 animate-spin"
          aria-hidden="true"
        />
      )}
      <span>{text}</span>
    </Button>
  )
}
