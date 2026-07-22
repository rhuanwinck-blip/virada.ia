export const designTokens = {
  colors: {
    background: "#020611",
    backgroundAlt: "#06101F",
    surface: "#08152A",
    surfaceElevated: "#0B203B",
    surfaceGlass: "rgba(7,22,43,0.76)",
    text: "#F5FBFF",
    textSecondary: "#A8BDD5",
    textMuted: "#6D83A1",
    primaryBlue: "#0A5CFF",
    electricBlue: "#2F7BFF",
    cyan: "#58C7FF",
    cyanSoft: "#9EE8FF",
    amber: "#F5C86C",
    error: "#FF6F91",
    border: "rgba(158,232,255,0.13)",
    borderActive: "rgba(88,199,255,0.44)",
    glowBlue: "rgba(10,92,255,0.28)",
    glowCyan: "rgba(88,199,255,0.24)"
  },
  gradients: {
    commandBlue: "linear-gradient(135deg, #0A5CFF 0%, #58C7FF 100%)",
    cyanGlass: "linear-gradient(180deg, rgba(88,199,255,0.10), rgba(255,255,255,0.02))",
    deepRadial: "radial-gradient(circle at 50% 0%, rgba(88,199,255,0.16), transparent 42%), #020611"
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
