export function LissLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10"
    >
      {/* Green circle background */}
      <circle cx="20" cy="20" r="20" fill="#2D7D3D" />
      
      {/* Stylized hands holding/supporting a person (simplified) */}
      {/* Left hand */}
      <path
        d="M 8 22 Q 10 18 12 20 Q 14 22 12 26"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Right hand */}
      <path
        d="M 32 22 Q 30 18 28 20 Q 26 22 28 26"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Center figure */}
      <circle cx="20" cy="12" r="3" fill="#ffffff" />
      <path
        d="M 20 15 L 20 22"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Heart symbol inside */}
      <path
        d="M 20 24 Q 18 26 16 26 Q 14 26 14 24 Q 14 22 20 20 Q 26 22 26 24 Q 26 26 24 26 Q 22 26 20 24"
        fill="#E67E22"
      />
    </svg>
  );
}
