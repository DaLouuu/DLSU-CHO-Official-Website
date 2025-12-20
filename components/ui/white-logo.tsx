import Image from "next/image"

interface WhiteLogoProps {
  width?: number
  height?: number
  className?: string
}

export function WhiteLogo({ width = 120, height = 160, className = "" }: WhiteLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src="/images/dlsu-chorale-logo.png"
        alt="DLSU Chorale Logo"
        fill
        className="object-contain brightness-0 invert"
      />
    </div>
  )
}
