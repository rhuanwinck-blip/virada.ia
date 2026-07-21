export const designTokens = {
  colors: {
    background: "#05070D",
    backgroundAlt: "#090D17",
    card: "#0E1422",
    cardElevated: "#131B2D",
    text: "#F7F8FC",
    textSecondary: "#A7B0C0",
    textMuted: "#6D788B",
    green: "#5DFFB4",
    greenDeep: "#16C784",
    blue: "#5C8DFF",
    violet: "#9C6BFF",
    gold: "#D6B978",
    alert: "#FF7068",
    border: "rgba(255,255,255,0.10)",
    glowGreen: "rgba(93,255,180,0.22)",
    glowBlue: "rgba(92,141,255,0.20)"
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px"
  },
  duration: {
    fast: "160ms",
    base: "260ms",
    slow: "700ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    precise: "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  breakpoints: {
    sm: "520px",
    md: "820px",
    lg: "1120px"
  }
} as const;
