import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory, useParams } from 'react-router-dom'
import { api } from '../api'
import { Button, InputNumber, Slider, Tooltip, Typography } from 'antd'
import { FastBackwardOutlined, StepBackwardOutlined, StepForwardOutlined, FastForwardOutlined } from '@ant-design/icons'
import { Scene } from '../components/scene'
import { loadModules } from 'esri-loader'
import { Map as EsriMap } from '@esri/react-arcgis'
import { useRouteBrowserContext } from '../contexts'

const { Paragraph, Title } = Typography

// main view

export const BrowseRouteView = () => {

  return (
    <div>
      <Title level={ 1 }>Browsing route</Title>
    </div>
  )
}

      // points={ [[currentLocation.lat, currentLocation.long]] } />