import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
  href?: string
  withText?: boolean
  variant?: 'light' | 'dark'
  lightSrc?: string
  darkSrc?: string
  className?: string
  iconContainerClassName?: string
  imageClassName?: string
  textClassName?: string
  text?: string
}

export function BrandLogo({
  href = '/',
  withText = true,
  variant = 'light',
  lightSrc = '/YB%20logo/lightversion.png',
  darkSrc = '/YB%20logo/darkversion.png',
  className = '',
  iconContainerClassName = '',
  imageClassName = '',
  textClassName = '',
  text = 'Fashion Design',
}: BrandLogoProps) {
  const selectedSrc = variant === 'dark' ? darkSrc : lightSrc

  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`.trim()}>
      <div
        className={`flex h-11 w-11 items-center justify-center ${iconContainerClassName}`.trim()}
      >
        <Image
          src={selectedSrc}
          alt="YB Fashion Design Logo"
          width={44}
          height={44}
          className={`h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] ${imageClassName}`.trim()}
          priority
        />
      </div>
      {withText ? <span className={textClassName}>{text}</span> : null}
    </Link>
  )
}