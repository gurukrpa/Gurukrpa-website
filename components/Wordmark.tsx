import React from 'react';
import { Cinzel } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['700', '900'] });

type WordmarkProps = {
  className?: string;
  /**
   * Optional font size override. Uses CSS font-size value (e.g., '3rem', 'clamp(2rem,6vw,6rem)').
   * If omitted, inherit from parent or Tailwind classes.
   */
  size?: string;
};

/**
 * Gurukrpa wordmark styled to closely match the provided reference.
 * Key styling:
 * - Cinzel 900 uppercase with wide letter spacing
 * - Pale yellow fill with subtle outline and soft glow
 * - Red bindu dot positioned between KR and PA
 */
export default function Wordmark({ className = '', size }: WordmarkProps) {
  const color = '#F1E7A2'; // pale yellow
  const stroke = '#D6CB83'; // slightly darker outline

  const textStyle: React.CSSProperties = {
    color,
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    WebkitTextStroke: '0.6px ' + stroke,
    textShadow:
      '0 0 2px rgba(241,231,162,0.8), 0 0 6px rgba(241,231,162,0.45), 0 0 14px rgba(241,231,162,0.25)',
    lineHeight: 1.05,
    fontSize: size,
  };

  // Dot sized relative to font-size using em for consistent look across sizes
  const dotStyle: React.CSSProperties = {
    position: 'absolute',
    right: '-0.12em',
    bottom: '-0.12em',
    width: '0.28em',
    height: '0.28em',
    borderRadius: '9999px',
    background: '#E01817',
    boxShadow: '0 0 6px rgba(224,24,23,0.55)',
  };

  return (
    <div className={`relative inline-block select-none ${cinzel.className} ${className}`} style={{ fontSize: size }}>
      <span style={textStyle} className="tracking-[0.16em]">
        GU
        <span className="relative inline-block">
          RU
          <span aria-hidden style={dotStyle} />
        </span>
        KRPA
      </span>
    </div>
  );
}
