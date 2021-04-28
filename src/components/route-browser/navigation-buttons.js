import React from 'react'
import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { ArrowRightOutlined, FastBackwardOutlined, StepBackwardOutlined, StepForwardOutlined, FastForwardOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useRouteBrowseContext } from './context'

const BrowseButton = ({ path, tooltip, ...props }) => {
  const history = useHistory()
  return (
    <Tooltip placement="top" title={ tooltip }>
      <Button type="primary" onClick={ () => history.push(path) } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} { ...props } />
    </Tooltip>
  )
}

BrowseButton.propTypes = {
  path: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
}

export const NavigationButtons = () => {
  const { imageIDs, index, routeID } = useRouteBrowseContext()

  if (!(index + 1) || !imageIDs.length) return '...'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <BrowseButton
        path={ `/routes/${ routeID }/${ index }` }
        disabled={ index <= 0 }
        tooltip="Step backward"
      >
        <StepBackwardOutlined /> Previous
      </BrowseButton>
      <BrowseButton
        path={ `/routes/${ routeID }/${ index + 2 }` }
        disabled={ imageIDs.length <= index + 1 }
        tooltip="Step forward"
      >
        Next <StepForwardOutlined />
      </BrowseButton>
    </div>
  )
}
