import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Slider, Tooltip } from 'antd'
import { useRouteContext } from '../context'

export const NavigationSlider = () => {
  const history = useHistory()
  const { images, index, routeID } = useRouteContext()

  const handleSliderChange = newIndex => {
    history.push(`/routes/${ routeID }/${ newIndex }`)
  }

  return (
    <Slider
      className="navigation-slider"
      defaultValue={ 1 }
      value={ index + 1 }
      min={ 1 }
      max={ images.length }
      onChange={ handleSliderChange }
      tipFormatter={ value => `${ value } of ${ images.length }`}
      tooltipPlacement="bottom"
    />
  )
}
