import React, { Fragment, useMemo, useState } from 'react'
import { useRouteContext } from '../context'

export const ScatterplotPoint = ({
  node,
  x, y,
  size, color, blendMode,
  onMouseEnter, onMouseMove, onMouseLeave,
  onClick,
}) => {
  const { imageIndex, images } = useRouteContext()

  let fillColor = 'var(--color-neutral)'
  let strokeColor = '#999'
  let opacity = 0.66
  if (node.data?.image?.features[node.data.serieId] && typeof node.data.image.features[node.data.serieId].annotation === 'boolean') {
    fillColor = node.data.image.features[node.data.serieId].annotation ? 'var(--color-positive)' : 'var(--color-negative)'
    strokeColor = '#222'
    opacity = 1
  }

  const active = useMemo(() => {
    return node.data.image && +imageIndex === node.data.image.index
  }, [node.data, imageIndex])

  return (
    <Fragment>
      <g transform={`translate(${ x },${ y })`}>
        {
          /* active node indicator */
          active && (
            <circle className="active-indicator" r={ 3 * size } fill="none" stroke="#111" strokeWidth="1" style={{ mixBlendMode: blendMode }}>
              <animate attributeName="r" begin="0s" dur="1s" repeatCount="indefinite" from="3" to="12"/>
              <animate attributeName="opacity" begin="0s" dur="1s" repeatCount="indefinite" from="1" to="0"/>
            </circle>
          )
        }
        {/* the actual node */}
        <circle
          r={ active ? size : size / 2 }
          fill={ fillColor }
          style={{ mixBlendMode: blendMode, opacity: opacity }}
          stroke={ strokeColor }
          strokeWidth="1"
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
