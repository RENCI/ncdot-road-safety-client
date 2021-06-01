import React from 'react'
import { Tooltip, Button } from 'antd'
import {
  CarOutlined as DriveIcon,
  InfoCircleOutlined as SummaryIcon,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './browse-route-button.css'

export const BrowseRouteButton = ({ routeID, imageIndex }) => {
  const history = useHistory()
  const routePath = `/routes/${ routeID }/${ imageIndex }`
  
  return (
    <div className="route-action-buttons-container">
      <Tooltip title="View Route Summary" placement="left">
        <Button type="default" onClick={ () => history.push(routePath) } className="route-action-button" icon={ <SummaryIcon /> } />
      </Tooltip>
      <Tooltip title="Drive this Route" placement="left">
        <Button type="default" onClick={ () => history.push(routePath) } className="route-action-button" icon={ <DriveIcon /> } />
      </Tooltip>
    </div>
  )
}
