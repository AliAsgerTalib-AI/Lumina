import React from "react";

interface SympheryIconProps {
  className?: string;
}

export default function SympheryIcon({ className = "h-10 w-10" }: SympheryIconProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* A rich gradient that flows from deep ocean blue through teal to glowing emerald/cyan */}
        <linearGradient id="symphery-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#103F6E" />
          <stop offset="30%" stopColor="#146694" />
          <stop offset="60%" stopColor="#009A92" />
          <stop offset="85%" stopColor="#00C49F" />
          <stop offset="100%" stopColor="#2CE8C4" />
        </linearGradient>

        {/* Subtle drop shadow/glow for depth */}
        <filter id="symphery-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#009A92" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#symphery-glow)">
        {/* UPPER PORTION: Network Mesh Dome (Symmetrical Nodes) */}
        {/* Dome network mesh backing lines */}
        <path
          d="M 230 145 C 240 100, 280 70, 325 70 C 370 70, 405 100, 415 145"
          stroke="url(#symphery-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 6"
          opacity="0.8"
        />
        
        {/* Connective lines within the mesh dome */}
        <path
          d="M 283 130 L 325 70 M 325 70 L 367 130 M 283 130 L 367 130 M 283 130 L 325 170 M 367 130 L 325 170 M 325 70 L 325 170 M 240 120 L 283 130 M 410 120 L 367 130"
          stroke="url(#symphery-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Node dots (filled) */}
        <circle cx="325" cy="70" r="10" fill="url(#symphery-grad)" />
        <circle cx="283" cy="130" r="9" fill="url(#symphery-grad)" />
        <circle cx="367" cy="130" r="9" fill="url(#symphery-grad)" />
        <circle cx="325" cy="170" r="8" fill="url(#symphery-grad)" />
        <circle cx="240" cy="120" r="6" fill="url(#symphery-grad)" />
        <circle cx="410" cy="120" r="6" fill="url(#symphery-grad)" />

        {/* MIDDLE/SPINE: Circuit and tech pathway */}
        {/* Outer backbone ribbon forming S shape */}
        <path
          d="M 390 156 C 290 105, 185 190, 260 255 C 315 300, 335 345, 275 405"
          stroke="url(#symphery-grad)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circuit pathway lines terminating in points */}
        <path
          d="M 225 210 Q 255 210, 260 230"
          stroke="url(#symphery-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="260" cy="235" r="7" fill="url(#symphery-grad)" />

        <path
          d="M 305 275 Q 275 275, 270 295"
          stroke="url(#symphery-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="270" cy="300" r="7" fill="url(#symphery-grad)" />

        {/* LOWER PORTION: DNA Double Helix Structure */}
        {/* Secondary strand of the double helix spiraling parallel */}
        <path
          d="M 252 268 C 295 315, 305 348, 240 395"
          stroke="url(#symphery-grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Helix ladder rungs / base pairs */}
        <line x1="284" y1="280" x2="260" y2="288" stroke="url(#symphery-grad)" strokeWidth="8" strokeLinecap="round" />
        <line x1="298" y1="305" x2="274" y2="310" stroke="url(#symphery-grad)" strokeWidth="8" strokeLinecap="round" />
        <line x1="302" y1="332" x2="280" y2="334" stroke="url(#symphery-grad)" strokeWidth="8" strokeLinecap="round" />
        <line x1="295" y1="358" x2="274" y2="356" stroke="url(#symphery-grad)" strokeWidth="8" strokeLinecap="round" />
        <line x1="280" y1="382" x2="258" y2="376" stroke="url(#symphery-grad)" strokeWidth="8" strokeLinecap="round" />

        {/* DNA Strand tails on the bottom hook of the 'S' */}
        <path
          d="M 275 405 C 240 435, 195 435, 190 415"
          stroke="url(#symphery-grad)"
          strokeWidth="20"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tail split fork */}
        <path
          d="M 197 418 C 180 410, 165 425, 160 445"
          stroke="url(#symphery-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
