"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
}

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400/dcfce7/16a34a?text=MicroGreen"

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  sizes,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  
  const imageSrc = error || !src ? PLACEHOLDER_IMAGE : src

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={cn("object-cover", className)}
          onError={() => setError(true)}
          priority={priority}
          sizes={sizes}
          unoptimized={imageSrc.includes('placehold.co')}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt}
          width={width || 400}
          height={height || 400}
          className={cn("object-cover", className)}
          onError={() => setError(true)}
          priority={priority}
          unoptimized={imageSrc.includes('placehold.co')}
        />
      )}
    </div>
  )
}

// Hook for generating placeholder images
export function usePlaceholderImage(text: string, width = 400, height = 400) {
  return `https://placehold.co/${width}x${height}/dcfce7/16a34a?text=${encodeURIComponent(text)}`
}

// Helper function for external image fallbacks
export function getImageWithFallback(src: string | null | undefined, fallbackText = "Product"): string {
  if (!src || src.trim() === "") {
    return `https://placehold.co/400x400/dcfce7/16a34a?text=${encodeURIComponent(fallbackText)}`
  }
  return src
}
