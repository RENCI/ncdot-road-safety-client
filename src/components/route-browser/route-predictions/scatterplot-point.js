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

  let fillColor = 'var(--color-neutral)'
  if (node.data?.image?.features[node.data.serieId] && typeof node.data.image.features[node.data.serieId].annotation === 'boolean') {
    fillColor = node.data.image.features[node.data.serieId].annotation ? 'var(--color-positive)' : 'var(--color-negative)'
  }

  useEffect(() => {
    setActive(node.data.image && +imageIndex === node.data.image.index)
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
        active && <path d={ `M${ x } ${ y },${ x } 200` } strokeWidth="1" stroke={ fillColor } strokeDasharray="5 2" />
      }
      {
        /* horizontal indicator */
        active && <path d={ `M-10 ${ y },${ x } ${ y }` } strokeWidth="1" stroke={ fillColor } strokeDasharray="5 2" />
      }
    </Fragment>
  )
}
