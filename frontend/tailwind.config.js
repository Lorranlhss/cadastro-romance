/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                romance: {
                    primary: '#E91E63',
                    secondary: '#F06292',
                    dark: '#C2185B',
                }
            }
        },
    },
    plugins: [],
}