/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '375px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            // Breakpoint personalizado para Galaxy Fold (pantalla expandida)
            'fold': '600px',
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                dark: {
                    bg: '#09090b', // zinc-950
                    surface: '#18181b', // zinc-900
                    surface2: '#27272a', // zinc-800
                    border: '#3f3f46', // zinc-700
                    text: '#e4e4e7', // zinc-200
                    text2: '#a1a1aa', // zinc-400
                },
                accent: {
                    DEFAULT: '#d97706', // amber-600
                    light: '#f59e0b', // amber-500
                    dark: '#b45309', // amber-700
                },
                premium: {
                    gold: '#eab308', // yellow-500
                    amber: '#f59e0b', // amber-500
                    bronze: '#d97706', // amber-600
                }
            },
            backgroundColor: {
                'dark-bg': '#09090b',
                'dark-surface': '#18181b',
                'dark-surface2': '#27272a',
            },
            borderColor: {
                'dark-border': '#3f3f46',
            },
            textColor: {
                'dark-text': '#e4e4e7',
                'dark-text2': '#a1a1aa',
            },
            animation: {
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                slideIn: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(217, 119, 6, 0.2), 0 0 10px rgba(217, 119, 6, 0.1)' },
                    '100%': { boxShadow: '0 0 20px rgba(217, 119, 6, 0.4), 0 0 30px rgba(217, 119, 6, 0.2)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
