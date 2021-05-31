import React from 'react'
import { Tooltip, Button } from 'antd'
import { ArrowRightOutlined as BrowseRouteIcon } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './browse-route-button.css'

export const BrowseRouteButton = ({ routeID, imageIndex }) => {
  const history = useHistory()
  const routePath = `/routes/${ routeID }/${ imageIndex }`
  
  return (
    <div className="button-container">
      <Tooltip title="Browse this Route" placement="left">
        <Button type="default" onClick={ () => history.push(routePath) } className="browse-route-button" icon={ <BrowseRouteIcon /> } />
      </Tooltip>
    </div>
  )
}
