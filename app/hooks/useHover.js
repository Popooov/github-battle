import React from 'react'

export default function useHover() {

    const [hovering, setHovering] = React.useState(false)

    const mouseOver = () => setHovering(true)
    const mouseOut = () => setHovering(false)

    return (
        {
            hovering, 
            mouseOver,
            mouseOut
        }
    )
}