import React, { Fragment } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

export const ContactView = () => {
  return (
    <Fragment>
      <Title level={ 1 }>Contact</Title>

      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </p>
    </Fragment>
  )
}
