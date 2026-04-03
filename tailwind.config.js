/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "instrument-serif-italic": "var(--instrument-serif-italic-font-family)",
        "instrument-serif-regular":
          "var(--instrument-serif-regular-font-family)",
        "pretendard-bold-upper": "var(--pretendard-bold-upper-font-family)",
        "pretendard-light": "var(--pretendard-light-font-family)",
        "pretendard-medium": "var(--pretendard-medium-font-family)",
        "pretendard-regular": "var(--pretendard-regular-font-family)",
        "pretendard-semibold": "var(--pretendard-semibold-font-family)",
        "semantic-heading-1": "var(--semantic-heading-1-font-family)",
        "semantic-input": "var(--semantic-input-font-family)",
      },
    },
  },
  plugins: [],
};