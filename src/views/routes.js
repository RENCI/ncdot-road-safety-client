import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory, useParams } from 'react-router-dom'
import { api } from '../api'
import { Button, Card, InputNumber, Select, Slider, Space, Table, Tooltip, Typography } from 'antd'
import { ArrowRightOutlined, FastBackwardOutlined, StepBackwardOutlined, StepForwardOutlined, FastForwardOutlined } from '@ant-design/icons'
import { Scene } from '../components/scene'
import { loadModules } from 'esri-loader'
import { Map as EsriMap } from '@esri/react-arcgis'
import { useRoutes } from '../contexts'

const { Paragraph, Title } = Typography
const { Option } = Select

// context

const RouteBrowseContext = React.createContext({ })
const useRouteBrowseContext = () => useContext(RouteBrowseContext)

// globals

let view
let autoCenter = false

const ncLatLong = [
  [33.7666, -84.3201], 
  [36.588, -75.4129]
]

// components

const ImagePrefetch = ({ url }) => <img src={ url } style={{ display: 'none' }} />

ImagePrefetch.propTypes = {
  url: PropTypes.string.isRequired,
}

const ScenePrefetch = ({ imageBaseName }) => {
  if (!imageBaseName) return null
  return (
    <Fragment>
      <ImagePrefetch url={ api.getImage(imageBaseName, 'left') } />
      <ImagePrefetch url={ api.getImage(imageBaseName, 'front') } />
      <ImagePrefetch url={ api.getImage(imageBaseName, 'right') } />
    </Fragment>
  )
}

ScenePrefetch.propTypes = {
  imageBaseName: PropTypes.string,
}

const RouteSelect = ({ currentRouteID, routeIDs, routeChangeHandler }) => {
  return (
    <Select defaultValue={ currentRouteID } onChange={ routeChangeHandler } size="large">
      { routeIDs.map(id => <Option key={ id } value={ id }>{ id }</Option>) }
    </Select>
  )
}

RouteSelect.propTypes = {
  currentRouteID: PropTypes.string.isRequired,
  routeIDs: PropTypes.array.isRequired,
  routeChangeHandler: PropTypes.func.isRequired,
}

const SceneMetaData = () => {
  const { imageIDs, currentLocation, index, routeID } = useRouteBrowseContext()
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '80%', opacity: 0.75 }}>
      <Paragraph style={{ textAlign: 'left' }}>
        { index } of { imageIDs.length }<br />
        Image ID: { imageIDs[index - 1] || '...' } <br/>
        Route ID: { routeID || '...' } <br/>
      </Paragraph>
      <Paragraph style={{ textAlign: 'right' }}>
        Latitude: { currentLocation.lat || '...' }<br />
        Longitude: { currentLocation.long || '...' }<br />
      </Paragraph>
    </div>
  )
}

const BrowseButton = ({ url, tooltip, ...props }) => {
  const history = useHistory()
  if (!tooltip) {
    return <Button type="primary" onClick={ () => history.push(url) } { ...props } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
  }
  return (
    <Tooltip placement="top" title={ tooltip }>
      <Button type="primary" onClick={ () => history.push(url) } { ...props } style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    </Tooltip>
  )
}

BrowseButton.propTypes = {
  url: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
}

// pagination-like navigation
const RouteNavigation = () => {
  const { imageIDs, index, routeID } = useRouteBrowseContext()

  const tenPrevIndex = useMemo(() => Math.max(1, index - 10), [index])
  const prevIndex = useMemo(() => Math.max(1, index - 1), [index])
  const nextIndex = useMemo(() => Math.min(imageIDs.length, index + 1), [index])
  const tenNextIndex = useMemo(() => Math.min(imageIDs.length, index + 10), [index])

  if (!index || !imageIDs.length) return '...'

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <BrowseButton url={ `/routes/${ routeID }/${ tenPrevIndex }` } disabled={ index - 10 <= 0 } tooltip="Back ten images"><FastBackwardOutlined /> Back 10</BrowseButton>
      <BrowseButton url={ `/routes/${ routeID }/${ prevIndex }` } disabled={ index - 1 <= 0 } tooltip="Step backward"><StepBackwardOutlined /> Previous</BrowseButton>
      <BrowseButton url={ `/routes/${ routeID }/${ nextIndex }` } disabled={ index + 1 > imageIDs.length } tooltip="Step forward">Next <StepForwardOutlined /></BrowseButton>
      <BrowseButton url={ `/routes/${ routeID }/${ tenNextIndex }` } disabled={ index + 10 > imageIDs.length } tooltip="Forward ten images">Forward 10 <FastForwardOutlined /></BrowseButton>
    </div>
  )
}

// custom component for map location marker
const MapMarker = ({ view, lat, long, color = '#1890ff', size = 15 }) => {
  const [graphic, setGraphic] = useState(null)

  const mapPoint = ({ long, lat }) => {
    const point = { type: 'point', longitude: long, latitude: lat }
    const markerSymbol = { type: 'simple-marker', size: size, color: color }
    return ({
      geometry: point,
      symbol: markerSymbol,
    })
  }

  useEffect(() => {
    // view.graphics.remove(graphic)
    view.graphics.removeAll()
  }, [lat, long, color, size])

  useEffect(() => {
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      let currentLocationPoint = new Graphic(mapPoint({ long, lat }))
      view.graphics.add(currentLocationPoint)
      setGraphic(graphic)
      view.center = [long, lat]
    }).catch(error => console.error(error))

    return function cleanup() {
      view.graphics.remove(graphic)
    }
  }, [lat, long, color, size])

  return null
}

// main view

export const BrowseRouteView = () => {
  const { routes } = useRoutes()
  const history = useHistory()
  const { routeID, imageIndex } = useParams()
  const [imageIDs, setImageIDs] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})
  console.log(imageIDs)

  // index for current location along route.
  // first picture is index 1, ...
  // not starting at 0, as that may be confusing for some users seeing the URL
  const index = useMemo(() => {
    // if no route or no images on route
    if (!routeID || imageIDs.length === 0) { return 0 }
    // if image index lies outside 0..(# of images)
    if (imageIndex < 1 || imageIndex > imageIDs.length) { return 0 }
    // if the image index contains only digits
    if (/^\d+$/.test(imageIndex)) { return +imageIndex }
    return 1
  }, [imageIDs, imageIndex])

  // allow route navigation by clicking on slider component
  const handleSliderChange = newIndex => {
    history.push(`/routes/${ routeID }/${ newIndex }`)
  }

  // when user selects route in route select component
  const handleChangeRoute = routeID => {
    history.push(`/routes/${ routeID }/1`)
  }

  // on render,
  // fetch all routes for populating route selction component
  // useEffect(() => {
  //   const fetchallRoutes = async () => await api.getAllRoutes()
  //     .then(response => {
  //       console.log(response)
  //     })
  //     .catch(error => console.error(error))
  //   fetchallRoutes()
  // }, [])

  // get all the images on this route
  useEffect(() => {
    const fetchRouteImageBaseNames = async () => await api.getRouteInfo(routeID)
      .then(response => {
        if (response?.data?.route_image_base_names) {
          setImageIDs(response.data.route_image_base_names)
        }
      })
      .catch(error => console.error(error))
    fetchRouteImageBaseNames()
  }, [routeID])

  // when image (index) changes,
  // update the document title with route & image info
  useEffect(() => {
    document.title = `Route ${ routeID }, #${ index } | RoHAnn`
  }, [index])

  // when image (index) changes,
  // fetch metadata for the current location's scene
  useEffect(() => {
    const fetchSceneMetadata = async () => await api.getImageMetadata(imageIDs[index])
      .then(response => {
        setCurrentLocation(response.data.metadata)
      })
      .catch(error => console.error(error))
    if (imageIDs.length && index) {
      fetchSceneMetadata()
    }
  }, [index])

  // wait for routeID and its imageIDs
  if (!imageIDs.length || !routeID) {
    if (!routes.length) {
      return <p>Fetching routes...</p>
    }
    return (
      <Table
        dataSource={ routes.map(id => ({
          id: id,
          name: `Route ${ id }`,
        })) }
        columns={ [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Actions', key: 'actions', render: (text, record) => <Space size="middle"><Button link href={ `/routes/${ record.id }/1` } >Browse</Button></Space> },
        ] }
      />
    )
  }

  return (
    <RouteBrowseContext.Provider value={{ routeID, imageIDs, setImageIDs, index, currentLocation }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Title level={ 1 }>Route Browser</Title>
        <Title level={ 4 }>
          Current route: &nbsp;&nbsp;
          { routes && <RouteSelect routeIDs={ routes.sort() } currentRouteID={ routeID } routeChangeHandler={ handleChangeRoute } /> }
        </Title>
      </div>
      
      <br /><br />

      <RouteNavigation />

      <br />

      <Slider
        defaultValue={ 1 }
        value={ index }
        min={ 1 }
        max={ imageIDs.length }
        onChange={ handleSliderChange }
        tipFormatter={ value => `${ value } of ${ imageIDs.length }`}
        tooltipPlacement="bottom"
      />

      <br /><br />

      <Scene id={ imageIDs[index - 1] } />
      <SceneMetaData />

      <ScenePrefetch imageBaseName={ imageIDs[index - 20] } />
      <ScenePrefetch imageBaseName={ imageIDs[index - 10] } />
      <ScenePrefetch imageBaseName={ imageIDs[index - 2] } />
      <ScenePrefetch imageBaseName={ imageIDs[index - 1] } />
      <ScenePrefetch imageBaseName={ imageIDs[index + 1] } />
      <ScenePrefetch imageBaseName={ imageIDs[index + 2] } />
      <ScenePrefetch imageBaseName={ imageIDs[index + 10] } />
      <ScenePrefetch imageBaseName={ imageIDs[index + 20] } />

      <hr/>

      <div style={{ height: '400px' }}>
        <EsriMap
          style={{ border: '1px solid var(--primary)', borderRadius: '3px', overflow: 'hidden' }}
          mapProperties={{ basemap: 'gray-vector' }}
          viewProperties={{
            center: [currentLocation.long, currentLocation.lat],
            zoom: 15
        }}>
          <MapMarker lat={ currentLocation.lat } long={ currentLocation.long } />
        </EsriMap>
      </div>

    </RouteBrowseContext.Provider>
  )
}

      // points={ [[currentLocation.lat, currentLocation.long]] } />