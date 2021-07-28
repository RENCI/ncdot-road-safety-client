import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Button, Space, Tooltip } from 'antd'
import {
  CaretLeftOutlined as PrevIcon,
  CaretRightOutlined as NextIcon,
  BackwardOutlined as FastBackIcon,
  ForwardOutlined as FastForwardIcon,
} from '@ant-design/icons'
import { useRouteContext } from '../context'
import { useLocalStorage } from '../../../hooks'

const BrowseButton = ({ path, tooltip, ...props }) => {
  const history = useHistory()
  return (
    <Tooltip placement="top" title={ tooltip }>
      <Button
        className="navigation-button"
        type="primary"
        onClick={ () => history.push(path) }
        { ...props }
      />
    </Tooltip>
  )
}

BrowseButton.propTypes = {
  path: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
}

//

export const NavigationButtons = () => {
  const { images, index, routeID, falseNegatives, falsePositives, selectedFeature, setSelectedFeature } = useRouteContext()
  
  if (!(index + 1) || !images.length) return '...'
  
  const nextErrorIndex = useMemo(() => {
    // we just need next largest index (farther from 0) that's an fn/fp
    const errorIndex = [...falseNegatives[selectedFeature], ...falsePositives[selectedFeature]]
      .sort((i, j) => i < j ? -1 : 1)
      .find(i => index + 1 < i)
    return errorIndex
  }, [falseNegatives, falsePositives, index, selectedFeature])

  const previousErrorIndex = useMemo(() => {
    // we just need next smallest (closer to 0) index that's an fn/fp
    const errorIndex = [...falseNegatives[selectedFeature], ...falsePositives[selectedFeature]]
      .sort((i, j) => i < j ? 1 : -1)
      .find(i => i < index + 1)
    return errorIndex
  }, [falseNegatives, falsePositives, index, selectedFeature])

  return (
    <Space className="navigation-buttons-container">
      <BrowseButton
        path={ `/routes/${ routeID }/${ previousErrorIndex }` }
        disabled={ !previousErrorIndex }
        tooltip={ previousErrorIndex ? `Skip to previous FN/FP (${ previousErrorIndex })` : undefined }
        icon={ <FastBackIcon /> }
      />
      <BrowseButton
        path={ `/routes/${ routeID }/${ index }` }
        disabled={ index <= 0 }
        tooltip="Step backward one image"
        icon={ <PrevIcon /> }
      />
      <BrowseButton
        path={ `/routes/${ routeID }/${ index + 2 }` }
        disabled={ images.length <= index + 1 }
        tooltip="Step forward one image"
        icon={ <NextIcon /> }
      />
      <BrowseButton
        path={ `/routes/${ routeID }/${ nextErrorIndex }` }
        disabled={ !nextErrorIndex }
        tooltip={ nextErrorIndex ? `Skip to next FN/FP (${ nextErrorIndex })` : undefined }
        icon={ <FastForwardIcon /> }
      />
    </Space>
  )
}
