/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                arabic: ['Cairo', 'sans-serif'], // Primary Arabic font
                amiri: ['Amiri', 'serif'],      // For formal text
            },
        },
    },
    plugins: [],
}
