import { useState, useEffect } from 'react'

export function useWindowWidth() {
    const [width, setWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth
        }
        return 1024 // Default para SSR
    })

    useEffect(() => {
        // Establecer el ancho inicial
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth)
        }

        const handleResize = () => {
            setWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
}

