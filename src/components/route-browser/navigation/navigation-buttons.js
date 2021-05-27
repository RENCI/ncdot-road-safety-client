import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { Button, Space, Tooltip } from 'antd'
import {
  CaretLeftOutlined as PrevIcon,
  CaretRightOutlined as NextIcon,
  BackwardOutlined as FastBackIcon,
  ForwardOutlined as FastForwardIcon,
} from '@ant-design/icons'
import { useRouteBrowseContext } from '../context'

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
  const { imageIDs, index, routeID } = useRouteBrowseContext()

  if (!(index + 1) || !imageIDs.length) return '...'

  return (
    <Space>
      <BrowseButton
        path={ `/routes/${ routeID }/${ index - 9 }` }
        disabled={ index - 9 <= 0 }
        tooltip="Skip backward ten images"
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
        disabled={ imageIDs.length <= index + 1 }
        tooltip="Step forward one image"
        icon={ <NextIcon /> }
      />
      <BrowseButton
        path={ `/routes/${ routeID }/${ index + 11 }` }
        disabled={ imageIDs.length <= index + 10 }
        tooltip="Skip forward ten images"
        icon={ <FastForwardIcon /> }
      />
    </Space>
  )
}
