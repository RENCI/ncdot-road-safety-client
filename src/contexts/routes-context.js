import React, { createContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const initialState = []

const reducer = (state, action) => {
  switch (action.type) {
    case 'setRoutes':
      return [...action.routes]

    default: 
      throw new Error('Invalid routes context action: ' + action.type)
  }
}

export const RoutesContext = createContext(initialState)

export const RoutesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/get_all_routes/')

        dispatch({ 
          type: 'setRoutes',
          routes: [...response.data.route_ids]
        })
      }
      catch (error) {
        console.log(error)
      }
    })()
  }, [])
 
  return (
    <RoutesContext.Provider value={ [state, dispatch] }>
      { children }
    </RoutesContext.Provider>
  )
} 
