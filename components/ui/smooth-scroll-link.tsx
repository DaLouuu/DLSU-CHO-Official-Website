"use client"

import type React from "react"

import { forwardRef } from "react"
import Link from "next/link"

interface SmoothScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  offset?: number // Add offset option for fixed headers
}

export const SmoothScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  ({ href, children, offset = 80, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Only apply smooth scrolling for same-page hash links
      if (href.startsWith("#")) {
        e.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })

          // Update URL without reload
          window.history.pushState(null, "", href)
        }
      }

      // For regular links, let the default behavior happen
    }

    return (
      <Link href={href} onClick={handleClick} ref={ref} {...props}>
        {children}
      </Link>
    )
  },
)

SmoothScrollLink.displayName = "SmoothScrollLink"
