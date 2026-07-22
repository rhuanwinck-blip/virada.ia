export const designTokens = {
  colors: {
    background: "#04060B",
    backgroundAlt: "#070B14",
    surface: "#0B1120",
    surfaceElevated: "#10192C",
    surfaceGlass: "rgba(14,23,40,0.74)",
    text: "#F7F9FC",
    textSecondary: "#A6B0C3",
    textMuted: "#69758A",
    green: "#5CFFB0",
    greenDeep: "#13C77D",
    blue: "#558CFF",
    cyan: "#36D9FF",
    violet: "#9B70FF",
    gold: "#D4BA74",
    error: "#FF6470",
    border: "rgba(255,255,255,0.08)",
    borderActive: "rgba(92,255,176,0.35)",
    glowGreen: "rgba(92,255,176,0.22)",
    glowBlue: "rgba(85,140,255,0.20)"
  },
  gradients: {
    greenCyan: "linear-gradient(135deg, #5CFFB0 0%, #36D9FF 100%)",
    blueViolet: "linear-gradient(135deg, #558CFF 0%, #9B70FF 100%)",
    greenBlue: "linear-gradient(135deg, #5CFFB0 0%, #558CFF 100%)",
    deepRadial: "radial-gradient(circle at 50% 0%, rgba(92,255,176,0.16), transparent 42%), #04060B"
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px"
  },
  duration: {
    fast: "150ms",
    normal: "300ms",
    elegant: "500ms",
    narrative: "800ms"
  },
  springs: {
    default: { stiffness: 160, damping: 24, mass: 0.8 },
    soft: { stiffness: 90, damping: 22, mass: 1 }
  },
  breakpoints: {
    sm: "520px",
    md: "820px",
    lg: "1120px"
  }
} as const;
