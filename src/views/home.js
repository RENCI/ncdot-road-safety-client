import React, { Fragment } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

export const HomeView = () => {
  return (
    <Fragment>
      <Title level={ 1 }>Home</Title>
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur.
      </p>

    </Fragment>
  )
}
