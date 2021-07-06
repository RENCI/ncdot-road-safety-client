import React from 'react'
import { Tooltip, Button } from 'antd'
import {
  CarOutlined as DriveIcon,
  InfoCircleOutlined as SummaryIcon,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './route-actions.css'

export const RouteActions = ({ routeID, imageIndex }) => {
  const history = useHistory()
  const routeSummaryPath = `/routes/${ routeID }/`
  const routeBrowsePath = `/routes/${ routeID }/${ imageIndex }`
  
  return (
    <div className="route-actions">
      <Tooltip title="View Route Summary" placement="left">
        <Button type="default" onClick={ () => history.push(routeSummaryPath) } className="route-action-button" icon={ <SummaryIcon /> } />
      </Tooltip>
      <Tooltip title="Drive this Route" placement="left">
        <Button type="default" onClick={ () => history.push(routeBrowsePath) } className="route-action-button" icon={ <DriveIcon /> } />
      </Tooltip>
    </div>
  )
}
