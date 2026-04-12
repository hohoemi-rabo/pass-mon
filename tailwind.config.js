/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["MPlusRounded"],
        medium: ["MPlusRounded-Medium"],
        bold: ["MPlusRounded-Bold"],
      },
      colors: {
        primary: "#D4A056",
        "primary-dark": "#B8893E",
        secondary: "#5BBFB8",
        "secondary-dark": "#4AA9A2",
        background: "#091b36",
        card: "#0d2847",
        "card-elevated": "#112f52",
        text: "#FFFFFF",
        subtext: "#8BA3C4",
        danger: "#FF6B6B",
        "danger-dark": "#E85C5C",
        success: "#51CF66",
        border: "#1A3556",
        "input-border": "#2A4A6E",
        "input-focus": "#D4A056",
        "tab-bar": "#061527",
      },
      fontSize: {
        body: ["18px", { lineHeight: "28px" }],
        subtitle: ["20px", { lineHeight: "30px" }],
        title: ["24px", { lineHeight: "34px" }],
        header: ["28px", { lineHeight: "40px" }],
      },
      borderRadius: {
        card: "16px",
        button: "12px",
      },
    },
  },
  plugins: [],
};
