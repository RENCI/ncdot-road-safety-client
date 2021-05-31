import React, { useContext, useEffect, useState, useRef } from 'react'
import { AnnotationBrowserContext, useAccount } from '../../contexts'
import { Scene } from '../scene'
import { FlagControl } from './flag-control'
import { BrowseRouteButton } from './browse-route-button'
import { api } from '../../api'
import './annotation-panel.css'

export const AnnotationPanel = ({ image, autoAdjust, downsample, flagOptions, userFlagOptions, flagShortcuts }) => {
  const {} = useAccount()
  const tooltipTimeout = useRef()
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [, dispatch] = useContext(AnnotationBrowserContext)
  const [route, setRoute] = useState()
  const [imageIndex, setImageIndex] = useState(-1) // later, when image is found, this will become non-negative

  const { id, aspectRatio, present, flags } = image;

  const onImageClick = (id, view) => {
    const viewPresent = 
      present ? present[view] === "absent" ? "present" : present[view] === "present" ? "irrelevant" : "absent"
      : "absent"

    dispatch({
      type: 'setAnnotationPresent',
      id: id,
      view: view,
      present: viewPresent
    })
  }

  const onFlagChange = flag => {
    const newFlags = flags.includes(flag) ? 
      flags.filter(currentFlag => currentFlag !== flag) :
      flags.concat(flag)

    dispatch({
      type: 'setFlags',
      id: id,
      flags: newFlags
    })
  }

  const onPopoverVisibleChange = visible => {
    setPopoverVisible(visible)
  }

  const onRemoveUserFlagOption = option => {
    dispatch({
      type: 'removeUserFlagOption',
      option: option
    })
  }

  const onKeyPress = evt => {
    const flag = Object.keys(flagShortcuts).find(flag => flagShortcuts[flag].key === evt.key.toLowerCase())

    if (flag) {
      onFlagChange(flag)

      if (popoverVisible) {
        setTooltip(null)

        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)
      }
      else {
        if (flags.includes(flag)) {
          setTooltip('Removed ' + flag)        
        }
        else {
          setTooltip('Added ' + flag)
        }

        if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current)

        tooltipTimeout.current = setTimeout(() => setTooltip(null), 3000)
      }
    }
  }

  useEffect(() => {
    const fetchImageMetadata = async () => {
      try {
        const { data } = await api.getImageMetadata(image.id)
        if (!data) {
          throw new Error('error fetching image metadata')
        }
        setRoute(data.metadata.route_id)
      } catch (error) {
        console.error(error)
      }
    }
    fetchImageMetadata()
  }, [image])

  useEffect(() => {
    const fetchImageIndex = async () => {
      try {
        const { data } = await api.getRouteInfo(route)
        if (!data) {
          throw new Error('error fetching route info')
        }
        const index = data.route_image_info.findIndex(({ image_base_name }) => image_base_name === image.id)
        if (index > -1) {
          setImageIndex(index)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (route) {
      fetchImageIndex()
    }
  }, [route])

  return (    
    <div className='annotationPanel'>
      <FlagControl
        flags={ flags }
        options={ flagOptions }
        userOptions={ userFlagOptions }
        shortcuts={ flagShortcuts }
        tooltip={ tooltip }
        onFlagChange={ onFlagChange }
        onPopoverVisibleChange={ onPopoverVisibleChange }
        onRemoveUserFlagOption={ onRemoveUserFlagOption }
        onKeyPress={ onKeyPress }
      />

      <Scene 
        id={ id } 
        aspectRatio={ aspectRatio }
        present={ present }                 
        autoAdjust={ autoAdjust }
        downsample={ downsample }
        onClick={ onImageClick } 
        onKeyPress={ onKeyPress }
      />      

      { route && imageIndex > -1 && <BrowseRouteButton routeID={ route } imageIndex={ imageIndex } /> }

      { popoverVisible && <div className='overlay' /> }
    </div>
  )
}