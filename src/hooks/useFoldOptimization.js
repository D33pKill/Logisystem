import { useState, useEffect } from 'react'

export function useFoldOptimization() {
    const [isEnabled, setIsEnabled] = useState(() => {
        // Leer del localStorage, por defecto false (Modo Clásico)
        const saved = localStorage.getItem('foldOptimization')
        return saved ? JSON.parse(saved) : false
    })

    useEffect(() => {
        // Guardar en localStorage cada vez que cambie
        localStorage.setItem('foldOptimization', JSON.stringify(isEnabled))
    }, [isEnabled])

    const toggle = () => {
        setIsEnabled(prev => !prev)
    }

    return [isEnabled, toggle]
}

