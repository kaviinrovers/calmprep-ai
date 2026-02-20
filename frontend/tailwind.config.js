/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                'primary-shadow': '#1D4ED8', // Darker shade for 3D effect
                secondary: '#8B5CF6',
                'secondary-shadow': '#6D28D9',
                success: '#10B981',
                'success-shadow': '#047857',
                warning: '#F59E0B',
                'warning-shadow': '#B45309',
                danger: '#EF4444',
                'danger-shadow': '#B91C1C',
                'surface': '#F3F4F6',
                'surface-shadow': '#D1D5DB',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'bounce-slight': 'bounce-slight 2s infinite',
            },
            keyframes: {
                'bounce-slight': {
                    '0%, 100%': { transform: 'translateY(-2%)' },
                    '50%': { transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
