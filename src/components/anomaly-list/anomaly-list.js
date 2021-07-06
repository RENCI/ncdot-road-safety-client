import React from 'react'
import { Anomaly } from './anomaly'

export const AnomalyList = anomalies => {

  console.log(anomalies)

  return (
    <>
      <h3>AnomalyList</h3>
      <Anomaly />
      <Anomaly />
    </>
  )
}