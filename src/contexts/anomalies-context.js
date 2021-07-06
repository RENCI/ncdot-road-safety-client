import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../api'

const testData = [
  { name: 'guardrail', route: 40001171051, id: 32301115219, annotation: 'present', probability: 0.1 },  
  { name: 'guardrail', route: 40001171051, id: 32301095128, annotation: 'absent', probability: 0.9 }   
]

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
    dispatch({
      type: 'setAnomalies',
      anomalies: testData
    })
/*    

    const fetchAnomalies = async () => await api.getAnomalies()
      .then(response => {
        console.log(response)

        dispatch({ 
          type: 'setAnomalies',
          anomalies: [...response.data.anomalies]
        })
      })
      .catch(error => console.error(error))

    fetchAnomalies()
*/    
  }, [])

  return (
    <AnomaliesContext.Provider value={ [state, dispatch] }>
      { children }
    </AnomaliesContext.Provider>
  )
} 

export const useAnomalies = () => useContext(AnomaliesContext)
