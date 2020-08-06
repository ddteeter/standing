module.exports = {
  theme: {
    screens: {
      xs: "385px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    textShadow: {
      default: "4px 4px 3px rgba(203, 213, 224, 1)",
    },
  },
  variants: {
    textColor: ["responsive", "focus", "hover", "active"],
  },
  plugins: [require("tailwindcss-textshadow")],
};
