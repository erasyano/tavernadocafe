import React from "react";

export default function CobraNeonAnimada({ dimensions, lights = [], cloud = {}, raySide, angle = 0, formProgress = 1, animSide = { pulse: 1, fade: 1 }, getPartialPolylineFromTop }) {
  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fixed left-0 top-0 w-full h-full z-0 pointer-events-none select-none"
      style={{ minWidth: '100vw', minHeight: '100vh', filter: 'blur(12px) saturate(1.2) brightness(1.1)', mixBlendMode: 'screen' }}
    >
      <defs>
        {lights.map((l, i) => (
          <radialGradient key={i} id={`glow${i}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="60%" stopColor={l.color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0.01" />
          </radialGradient>
        ))}
        <radialGradient id="cloudBack" cx="50%" cy="60%" r="90%">
          <stop offset="0%" stopColor="#b6cfff" stopOpacity="0.18" />
          <stop offset="80%" stopColor="#222244" stopOpacity="0.01" />
        </radialGradient>
        <radialGradient id="cloudGlow2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7ed0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
        </radialGradient>
      </defs>
      <g>
        {lights.map((l, i) => (
          <circle
            key={i}
            cx={l.x}
            cy={l.y}
            r={l.r}
            fill={`url(#glow${i})`}
            opacity={0.7}
          />
        ))}
      </g>
      {cloud.back && (
        <path
          d={cloud.back}
          fill="url(#cloudBack)"
          opacity={0.7}
          filter="blur(8px)"
        />
      )}
      {cloud.main && (
        <path
          d={cloud.main}
          fill="url(#cloudGlow)"
          stroke="#b6cfff"
          strokeWidth={2.5}
          opacity={0.95}
          filter="blur(2.5px)"
        />
      )}
      {cloud.glow && (
        <path
          d={cloud.glow}
          fill="url(#cloudGlow2)"
          stroke="#7ed0ff"
          strokeWidth={4}
          opacity={0.7}
          filter="blur(1.5px)"
        />
      )}
      {cloud.main && (
        <path
          d={cloud.main}
          fill="none"
          stroke="#7ed0ff"
          strokeWidth={4}
          opacity={0.5}
          filter="url(#rayGlowFilter)"
        />
      )}
      {raySide && (
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${dimensions.width / 2}px 0px`
          }}
        >
          <polyline
            points={getPartialPolylineFromTop(raySide.main, formProgress).map(p => `${p.x},${p.y}`).join(' ')}
            stroke="url(#rayGlow)"
            strokeWidth={4.5}
            fill="none"
            filter="url(#rayGlowFilter)"
            opacity={0.98 * animSide.pulse * animSide.fade}
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 16px #fff)' }}
          />
          <polyline
            points={getPartialPolylineFromTop(raySide.main, formProgress).map(p => `${p.x},${p.y}`).join(' ')}
            stroke="url(#rayCore)"
            strokeWidth={1.2}
            fill="none"
            style={{ mixBlendMode: 'lighter', filter: 'drop-shadow(0 0 8px #fff)' }}
            opacity={1 * animSide.pulse * animSide.fade}
          />
        </g>
      )}
    </svg>
  );
}



