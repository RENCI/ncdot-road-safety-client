import React from 'react'
import PropTypes from 'prop-types'
import { Slider, Tooltip } from 'antd'
import { useHistory } from 'react-router-dom'
import { useRouteBrowseContext } from './context'

export const NavigationSlider = () => {
  const history = useHistory()
  const { imageIDs, index, routeID } = useRouteBrowseContext()

  const handleSliderChange = newIndex => {
    history.push(`/routes/${ routeID }/${ newIndex }`)
  }

  return (
    <Slider
      defaultValue={ 1 }
      value={ index + 1 }
      min={ 1 }
      max={ imageIDs.length }
      onChange={ handleSliderChange }
      tipFormatter={ value => `${ value } of ${ imageIDs.length }`}
      tooltipPlacement="bottom"
    />
  )
}
