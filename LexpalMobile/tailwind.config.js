/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                slate: { 900: '#0f172a', 800: '#1e293b' },
                blue: { 500: '#3b82f6', 600: '#2563eb' },
                teal: { 500: '#14b8a6', 600: '#0d9488' },
            },
        },
    },
    plugins: [],
    presets: [require("nativewind/preset")],
}