import React, { useState } from 'react';

/**
 * Vector reproduction of the official AVIDORE intertwined A + V monogram
 * matching the uploaded brand identity asset (/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.25.45__1__0b2f6030.jpeg)
 */
export const AvidoreMonogram: React.FC<{
  className?: string;
  color?: string;
}> = ({ className = 'w-10 h-10', color = '#985858' }) => (
  <svg
    viewBox="0 0 120 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left ascending leg of A (split politely around V curve) */}
    <path
      d="M60 12 L46 44 L51.5 47.5 L60 27 L83 84 C85.5 90 88.5 92.5 94 93.5 L94 95 L70 95 L70 93.5 C75 93 76.5 90.5 74.5 85 L56.5 39"
      fill={color}
    />
    <path
      d="M42.5 52.5 L28 85 C25.5 90.5 22.5 93 17 93.5 L17 95 L39 95 L39 93.5 C33.5 93 32 90 34.5 84 L47 56 Z"
      fill={color}
    />
    {/* Intertwined sweeping V arch */}
    <path
      d="M15 41.5 C29 41.5 38 49 46 65 L59.5 96 L73 65 C81 48 91 41.5 104 41.5 C93 44.5 84.5 52 77 68 L59.5 104 L41 67 C33.5 51.5 25.5 44 15 41.5 Z"
      fill={color}
    />
  </svg>
);

/**
 * Official brand card showcasing the original uploaded image file with fallback
 */
export const OfficialBrandShowcase: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#FFFFFF] border border-[#D8C9BD]/60 flex items-center justify-center p-8 ${className}`}
    >
      {!imgError ? (
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-03_at_19.25.45__1__0b2f6030.jpeg"
          alt="Identidade Visual Oficial AVIDORE — Monograma e Logotipo em Rosa Queimado"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full max-w-[340px] object-contain mx-auto select-none"
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AvidoreMonogram className="w-24 h-24 mb-4" color="#985858" />
          <span className="font-serif-editorial text-4xl tracking-[0.22em] text-[#985858] font-medium">
            AVIDORE
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Bespoke European Perfumery & Cosmetic Studio Photography Composition
 * Renders tactile stone pedestals, natural morning light shadows, glass vessels, rattan reeds,
 * and botanical details in the official Avidore palette.
 */
export const ProductStudioVisual: React.FC<{
  shape: 'reed_diffuser' | 'aromatic_kit' | 'cream_jar' | 'cleanser_pump' | 'serum_dropper';
  accentColor?: string;
  surfaceTone?: string;
  collectionRoman?: string;
  labelSubtitle?: string;
  className?: string;
}> = ({
  shape,
  accentColor = '#985858',
  surfaceTone = '#F6F1EB',
  collectionRoman = 'I',
  labelSubtitle = 'LABORATÓRIO OLFATIVO',
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`relative overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ backgroundColor: surfaceTone }}
    >
      {/* Architectural sunlight diagonal shadow overlay */}
      <svg
        viewBox="0 0 400 480"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Fotografia de estúdio Avidore — ${labelSubtitle}`}
      >
        <defs>
          <linearGradient id={`bg-grad-${shape}-${collectionRoman}`} x1="0" y1="0" x2="400" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FAF7F2" />
            <stop offset="55%" stopColor={surfaceTone} />
            <stop offset="100%" stopColor="#E5DACF" />
          </linearGradient>
          <linearGradient id="sunlight-beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#393331" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="travertine-stone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EFE9E0" />
            <stop offset="65%" stopColor="#DFD3C6" />
            <stop offset="100%" stopColor="#C9B9A9" />
          </linearGradient>
          <linearGradient id={`vessel-glass-${collectionRoman}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.92" />
            <stop offset="32%" stopColor={accentColor} stopOpacity="0.72" />
            <stop offset="78%" stopColor={accentColor} stopOpacity="0.88" />
            <stop offset="100%" stopColor="#393331" stopOpacity="0.95" />
          </linearGradient>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="12" dy="14" stdDeviation="10" floodColor="#393331" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* Studio backdrop */}
        <rect width="400" height="480" fill={`url(#bg-grad-${shape}-${collectionRoman})`} />

        {/* Architectural window light cast */}
        <polygon points="0,0 290,0 400,310 400,480 110,480 0,190" fill="url(#sunlight-beam)" />

        {/* Subtle botanical leaf shadow on wall */}
        <path
          d="M310 50 C275 85 265 135 295 175 C255 150 225 165 205 205 C245 205 275 195 305 180 C285 220 295 255 335 280"
          stroke="#393331"
          strokeOpacity="0.045"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Travertine Stone Pedestal Base */}
        <g filter="url(#soft-shadow)">
          <rect x="64" y="366" width="272" height="58" rx="2" fill="url(#travertine-stone)" />
          <line x1="64" y1="366" x2="336" y2="366" stroke="#FAF7F2" strokeWidth="1.5" />
          {/* Travertine natural mineral veins */}
          <path d="M90 388 Q155 384 210 391 T310 386" stroke="#B49B8D" strokeOpacity="0.35" strokeWidth="1" />
          <path d="M110 406 Q190 402 275 409" stroke="#B49B8D" strokeOpacity="0.25" strokeWidth="0.8" />
        </g>

        {/* SHAPE 1: REED DIFFUSER */}
        {shape === 'reed_diffuser' && (
          <g filter="url(#soft-shadow)">
            {/* Natural Rattan Reed Sticks */}
            <line x1="196" y1="205" x2="146" y2="54" stroke="#6E5A4F" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="199" y1="205" x2="174" y2="44" stroke="#846D60" strokeWidth="2.6" strokeLinecap="round" />
            <line x1="201" y1="205" x2="202" y2="40" stroke="#5A483E" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="203" y1="205" x2="230" y2="46" stroke="#7A6356" strokeWidth="2.6" strokeLinecap="round" />
            <line x1="205" y1="205" x2="256" y2="58" stroke="#6E5A4F" strokeWidth="2.8" strokeLinecap="round" />

            {/* Bottle Neck & Collar */}
            <rect x="180" y="188" width="40" height="22" rx="2" fill="#393331" />
            <rect x="184" y="182" width="32" height="7" rx="1" fill="#B49B8D" />

            {/* Heavy Glass Diffuser Vessel */}
            <rect
              x="138"
              y="208"
              width="124"
              height="158"
              rx="8"
              fill={`url(#vessel-glass-${collectionRoman})`}
              stroke="#FFFFFF"
              strokeOpacity="0.35"
              strokeWidth="1.2"
            />
            {/* Glass specular highlight */}
            <rect x="146" y="214" width="10" height="144" rx="4" fill="#FFFFFF" fillOpacity="0.22" />

            {/* Textured Ivory Paper Front Label */}
            <rect x="152" y="236" width="96" height="104" rx="1" fill="#F6F1EB" stroke="#D8C9BD" strokeWidth="0.8" />
            <rect x="156" y="240" width="88" height="96" fill="none" stroke="#985858" strokeOpacity="0.3" strokeWidth="0.6" />

            {/* Mini Monogram on Label */}
            <path d="M200 252 L192 270 L208 270 Z" fill="none" stroke="#985858" strokeWidth="1.2" />
            <path d="M188 260 Q200 278 212 260" fill="none" stroke="#985858" strokeWidth="1.2" />

            <text
              x="200"
              y="289"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="13"
              fontWeight="600"
              letterSpacing="3"
            >
              AVIDORE
            </text>
            <text
              x="200"
              y="305"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="11"
              fontStyle="italic"
              letterSpacing="1.5"
            >
              COLEÇÃO {collectionRoman}
            </text>
            <text
              x="200"
              y="322"
              textAnchor="middle"
              fill="#393331"
              fillOpacity="0.65"
              fontFamily="Manrope, sans-serif"
              fontSize="6.5"
              letterSpacing="1.8"
            >
              DIFUSOR DE AMBIENTE
            </text>
          </g>
        )}

        {/* SHAPE 2: AROMATIC KIT (Presentation Box + Diffuser + Home Spray Vessel) */}
        {shape === 'aromatic_kit' && (
          <g filter="url(#soft-shadow)">
            {/* Architectural Linen Rigid Gift Box Standing Behind */}
            <rect
              x="92"
              y="142"
              width="136"
              height="224"
              rx="2"
              fill="#F6F1EB"
              stroke="#D8C9BD"
              strokeWidth="1.5"
            />
            <rect
              x="100"
              y="150"
              width="120"
              height="208"
              fill="none"
              stroke="#985858"
              strokeOpacity="0.28"
              strokeWidth="0.8"
            />
            {/* Burnt Rose Grosgrain Ribbon Detail */}
            <rect x="92" y="242" width="136" height="14" fill="#985858" fillOpacity="0.9" />
            <text
              x="160"
              y="205"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="15"
              fontWeight="600"
              letterSpacing="3.5"
            >
              AVIDORE
            </text>
            <text
              x="160"
              y="222"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Manrope, sans-serif"
              fontSize="7"
              letterSpacing="2"
            >
              KIT AROMÁTICO · {collectionRoman}
            </text>

            {/* Foreground Vessel (Diffuser / Spray) */}
            <line x1="258" y1="226" x2="230" y2="112" stroke="#6E5A4F" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="262" y1="226" x2="262" y2="104" stroke="#846D60" strokeWidth="2.3" strokeLinecap="round" />
            <line x1="266" y1="226" x2="294" y2="114" stroke="#5A483E" strokeWidth="2.3" strokeLinecap="round" />

            <rect x="246" y="210" width="32" height="18" rx="2" fill="#393331" />
            <rect
              x="212"
              y="226"
              width="100"
              height="140"
              rx="6"
              fill={`url(#vessel-glass-${collectionRoman})`}
              stroke="#FFFFFF"
              strokeOpacity="0.35"
              strokeWidth="1"
            />
            <rect x="225" y="252" width="74" height="84" rx="1" fill="#F6F1EB" />
            <text
              x="262"
              y="290"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="11"
              fontWeight="600"
              letterSpacing="2.5"
            >
              AVIDORE
            </text>
            <text
              x="262"
              y="306"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="10"
              fontStyle="italic"
            >
              Coleção {collectionRoman}
            </text>
          </g>
        )}

        {/* SHAPE 3: CREAM JAR (Creme de Hidratação Avidore) */}
        {shape === 'cream_jar' && (
          <g filter="url(#soft-shadow)">
            {/* Cosmetic Outer Box Behind */}
            <rect x="100" y="176" width="118" height="190" rx="2" fill="#FFFFFF" stroke="#D8C9BD" strokeWidth="1.2" />
            <text
              x="159"
              y="235"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="13"
              letterSpacing="3"
            >
              AVIDORE
            </text>
            <text
              x="159"
              y="254"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Manrope, sans-serif"
              fontSize="7"
              letterSpacing="1.6"
            >
              CUIDADOS PESSOAIS
            </text>

            {/* Frosted Architectural Glass Cream Jar */}
            <rect x="176" y="252" width="136" height="24" rx="3" fill="#393331" />
            <rect x="180" y="274" width="128" height="4" fill="#B49B8D" />
            <rect
              x="172"
              y="278"
              width="144"
              height="88"
              rx="10"
              fill="#FAF7F2"
              stroke="#D8C9BD"
              strokeWidth="1.5"
            />
            <rect x="188" y="294" width="112" height="56" rx="1" fill="#FFFFFF" stroke="#E5DACF" strokeWidth="0.8" />
            <text
              x="244"
              y="318"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="13"
              fontWeight="600"
              letterSpacing="2.8"
            >
              AVIDORE
            </text>
            <text
              x="244"
              y="334"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Manrope, sans-serif"
              fontSize="7.5"
              letterSpacing="1.5"
            >
              CREME DE HIDRATAÇÃO
            </text>
          </g>
        )}

        {/* SHAPE 4: CLEANSER PUMP (Sabonete de Limpeza Facial Avidore) */}
        {shape === 'cleanser_pump' && (
          <g filter="url(#soft-shadow)">
            {/* Pump Dispenser Head */}
            <path d="M192 132 L226 132 L234 140 L192 140 Z" fill="#393331" />
            <rect x="194" y="140" width="12" height="22" fill="#B49B8D" />
            <rect x="182" y="162" width="36" height="20" rx="2" fill="#393331" />

            {/* Tall Minimalist Matte Cosmetic Bottle */}
            <rect
              x="146"
              y="182"
              width="108"
              height="184"
              rx="12"
              fill="#F6F1EB"
              stroke="#D8C9BD"
              strokeWidth="1.5"
            />
            <rect x="156" y="192" width="8" height="164" rx="4" fill="#FFFFFF" fillOpacity="0.6" />

            {/* Label */}
            <rect x="158" y="220" width="84" height="114" rx="1" fill="#FFFFFF" stroke="#D8C9BD" strokeWidth="0.8" />
            <line x1="172" y1="242" x2="228" y2="242" stroke="#985858" strokeWidth="0.8" />
            <text
              x="200"
              y="266"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="13"
              fontWeight="600"
              letterSpacing="3"
            >
              AVIDORE
            </text>
            <text
              x="200"
              y="286"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Manrope, sans-serif"
              fontSize="7"
              letterSpacing="1.4"
            >
              SABONETE DE
            </text>
            <text
              x="200"
              y="298"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Manrope, sans-serif"
              fontSize="7"
              letterSpacing="1.4"
            >
              LIMPEZA FACIAL
            </text>
            <text
              x="200"
              y="318"
              textAnchor="middle"
              fill="#393331"
              fillOpacity="0.55"
              fontFamily="Manrope, sans-serif"
              fontSize="6"
              letterSpacing="1.2"
            >
              CUIDADOS PESSOAIS
            </text>
          </g>
        )}

        {/* SHAPE 5: SERUM DROPPER (Sérum Avidore) */}
        {shape === 'serum_dropper' && (
          <g filter="url(#soft-shadow)">
            {/* Rubber Pipette Bulb */}
            <path d="M188 158 C188 138 212 138 212 158 L212 178 L188 178 Z" fill="#393331" />
            {/* Metallic Collar */}
            <rect x="182" y="178" width="36" height="20" rx="2" fill="#B49B8D" />
            <line x1="182" y1="184" x2="218" y2="184" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="1" />

            {/* Precision Amber/Rose Tinted Serum Bottle */}
            <path
              d="M182 198 L218 198 L244 222 L244 358 C244 362 240 366 236 366 L164 366 C160 366 156 362 156 358 L156 222 Z"
              fill="url(#vessel-glass-I)"
              stroke="#FFFFFF"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            <rect x="164" y="228" width="6" height="126" rx="3" fill="#FFFFFF" fillOpacity="0.25" />

            {/* Label */}
            <rect x="166" y="242" width="68" height="96" rx="1" fill="#F6F1EB" stroke="#D8C9BD" strokeWidth="0.8" />
            <text
              x="200"
              y="276"
              textAnchor="middle"
              fill="#393331"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="12"
              fontWeight="600"
              letterSpacing="2.5"
            >
              AVIDORE
            </text>
            <text
              x="200"
              y="296"
              textAnchor="middle"
              fill="#985858"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontSize="11"
              fontStyle="italic"
            >
              Sérum Facial
            </text>
            <text
              x="200"
              y="316"
              textAnchor="middle"
              fill="#393331"
              fillOpacity="0.6"
              fontFamily="Manrope, sans-serif"
              fontSize="6"
              letterSpacing="1.4"
            >
              CUIDADOS PESSOAIS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
