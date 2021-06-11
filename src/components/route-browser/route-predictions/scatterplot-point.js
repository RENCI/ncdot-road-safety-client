import React, { Fragment, useEffect, useState } from 'react'
import { useRouteContext } from '../context'

export const ScatterplotPoint = ({
  node,
  x, y,
  size, color, blendMode,
  onMouseEnter, onMouseMove, onMouseLeave,
  onClick,
}) => {
  const { imageIndex, images } = useRouteContext()
  const [active, setActive] = useState(false)

  const fillColor = node.data.image.features[node.data.serieId].annotation === 'N/A'
    ? 'var(--color-neutral)'
    : node.data.image.features[node.data.serieId].annotation === true
      ? 'var(--color-positive)'
      : 'var(--color-negative)'

  useEffect(() => {
    setActive(+imageIndex === node.data.image.index)
  }, [imageIndex])

  return (
    <Fragment>
      <g transform={`translate(${ x },${ y })`}>
        {
          /* active node indicator */
          active && (
            <circle className="active-indicator" r={ size } fill={ fillColor } style={{ mixBlendMode: blendMode }}>
              <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" from="3" to="12"/>
              <animate attributeName="opacity" begin="0s" dur="1s" repeatCount="indefinite" from="1" to="0"/>
            </circle>
          )
        }
        {/* the actual node */}
        <circle
          r={ active ? size : size / 2 }
          fill={ fillColor }
          style={{ mixBlendMode: blendMode }}
          onMouseEnter={ onMouseEnter }
          onMouseLeave={ onMouseLeave }
          onClick={ onClick }
        />
      </g>
      {
        /* vertical indicator */
        active && <path d={ `M${ x } ${ y },${ x } 200` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" />
      }
      {
        /* horizontal indicator */
        active && <path d={ `M0 ${ y },${ x } ${ y }` } strokeWidth="0.5" stroke="#000000" strokeDasharray="5,5" />
      }
    </Fragment>
  )
}
