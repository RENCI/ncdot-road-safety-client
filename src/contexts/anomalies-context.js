import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../api'

const initialState = []

const reducer = (state, action) => {
  switch (action.type) {
    case 'setAnomalies':
      return [...action.anomalies]

    default: 
      throw new Error('Invalid anomalies context action: ' + action.type)
  }
}

export const AnomaliesContext = createContext(initialState)

export const AnomaliesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchAnomalies = async () => await api.getAnomalies()
      .then(response => {
        console.log(response)

        /*
        dispatch({ 
          type: 'setAnomalies',
          anomalies: [...response.data.anomalies]
        })
        */

      })
      .catch(error => console.error(error))

    fetchAnomalies()
  }, [])

  return (
    <AnomaliesContext.Provider value={{ anomalies: state, dispatch }}>
      { children }
    </AnomaliesContext.Provider>
  )
} 

export const useAnomalies = () => useContext(AnomaliesContext)
