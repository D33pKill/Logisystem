import { useEffect, useState } from 'react'

export function useCountUp(endValue, duration = 1500) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime
        let animationFrame

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            setCount(Math.floor(progress * endValue))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [endValue, duration])

    return count
}
