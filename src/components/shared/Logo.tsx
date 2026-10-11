'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showText?: boolean;
  href?: string;
}

export default function Logo({
  className = '',
  size = 'md',
  variant = 'dark',
  showText = true,
  href = '/',
}: LogoProps) {
  const iconDimensions = {
    sm: { size: 28, textClass: 'text-base', subTextClass: 'text-[10px]' },
    md: { size: 36, textClass: 'text-lg', subTextClass: 'text-xs' },
    lg: { size: 48, textClass: 'text-2xl', subTextClass: 'text-sm' },
  }[size];

  const isLight = variant === 'light';

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div
        className={`relative shrink-0 rounded-xl overflow-hidden shadow-xs border transition-transform hover:scale-105 ${
          isLight
            ? 'border-white/20 bg-white'
            : 'border-[var(--soft-border)] bg-white'
        }`}
        style={{ width: iconDimensions.size, height: iconDimensions.size }}
      >
        <Image
          src="/logo.png"
          alt="Nijer Bazaar Logo"
          width={iconDimensions.size * 2}
          height={iconDimensions.size * 2}
          priority
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none ${iconDimensions.textClass} ${
            isLight ? 'text-white' : 'text-[var(--forest-teal)]'
          }`}>
            nijer bazaar<span className="text-[var(--fresh-lime)]">.</span>
          </div>
          <span className={`font-medium tracking-wider text-[9px] uppercase mt-0.5 leading-none ${
            isLight ? 'text-white/60' : 'text-[var(--muted-slate)]'
          }`}>
            নিজের বাজার
          </span>
        </div>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="group shrink-0">
      {content}
    </Link>
  );
}
