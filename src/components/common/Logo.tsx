interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-24 w-24"
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-md overflow-hidden`}>
      <img 
        src="/Official Brand Logo.jpg" 
        alt="Quiz Presenter Logo" 
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to SVG logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8B5CF6" />
                  <stop offset="50%" style="stop-color:#06B6D4" />
                  <stop offset="100%" style="stop-color:#10B981" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
              <path d="M8 12h16v2H8v-2zm0 4h16v2H8v-2zm0 4h12v2H8v-2z" fill="white" opacity="0.9"/>
              <circle cx="22" cy="20" r="3" fill="white" opacity="0.9"/>
              <path d="M20.5 20l1.5 1.5 3-3" stroke="white" stroke-width="1.5" fill="none" opacity="0.9"/>
            </svg>
          `;
        }}
      />
    </div>
  )
}
