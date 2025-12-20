export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f8f8f8]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
        {/* Musical notes pattern */}
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="music-pattern"
            patternUnits="userSpaceOnUse"
            width="100"
            height="100"
            patternTransform="rotate(10)"
          >
            <path d="M30,40 Q35,35 40,40 L40,70 Q35,75 30,70 Z" fill="#09331f" />
            <circle cx="30" cy="70" r="5" fill="#09331f" />
            <path d="M60,20 Q65,15 70,20 L70,50 Q65,55 60,50 Z" fill="#09331f" />
            <circle cx="60" cy="50" r="5" fill="#09331f" />
            <path d="M80,60 L90,60 L90,65 L80,65 L80,75 L75,75 L75,55 L80,55 Z" fill="#09331f" />
            <path d="M10,10 L20,10 L20,15 L10,15 L10,25 L5,25 L5,5 L10,5 Z" fill="#09331f" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#music-pattern)" />
        </svg>
      </div>

      {/* Accent corner elements */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#09331f"
            d="M39.9,-65.7C51.1,-58.4,59.5,-46.6,65.8,-33.8C72.1,-21,76.3,-7.1,74.8,6.1C73.3,19.3,66.1,31.8,56.8,42.1C47.5,52.4,36.1,60.5,23.1,66.2C10.1,71.9,-4.5,75.2,-17.8,72.2C-31.1,69.2,-43.1,59.9,-52.8,48.7C-62.5,37.5,-69.9,24.4,-73.1,10C-76.3,-4.4,-75.3,-20.1,-68.8,-32.8C-62.3,-45.5,-50.3,-55.2,-37.4,-61.5C-24.5,-67.8,-10.7,-70.7,2.2,-74.2C15.1,-77.7,28.7,-73,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] opacity-10">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#09331f"
            d="M47.7,-79.1C62.4,-71.9,75.3,-60.5,83.2,-46.3C91.1,-32.1,93.9,-16.1,92.3,-0.9C90.7,14.2,84.7,28.4,76.1,41.1C67.5,53.8,56.3,65,42.8,72.7C29.3,80.4,13.6,84.6,-1.4,86.8C-16.5,89,-33,89.2,-46.2,82.2C-59.5,75.2,-69.5,61,-77.2,45.9C-84.9,30.8,-90.3,15.4,-90.1,0.1C-89.9,-15.1,-84.1,-30.3,-75.1,-43C-66.1,-55.7,-53.9,-66,-40.3,-72.8C-26.7,-79.6,-11.7,-82.9,2.5,-87.1C16.7,-91.3,33,-86.3,47.7,-79.1Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
    </div>
  )
}
