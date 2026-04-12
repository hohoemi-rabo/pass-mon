/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF8C42",
        "primary-dark": "#E67A30",
        secondary: "#4ECDC4",
        "secondary-dark": "#3DBDB4",
        background: "#FFF8F0",
        card: "#FFFFFF",
        text: "#333333",
        subtext: "#888888",
        danger: "#FF6B6B",
        "danger-dark": "#E85C5C",
        success: "#51CF66",
        border: "#E5E5E5",
        "input-border": "#CCCCCC",
        "input-focus": "#FF8C42",
      },
      fontSize: {
        body: ["18px", { lineHeight: "28px" }],
        subtitle: ["20px", { lineHeight: "30px" }],
        title: ["24px", { lineHeight: "34px" }],
        header: ["28px", { lineHeight: "38px" }],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
      },
    },
  },
  plugins: [],
};
