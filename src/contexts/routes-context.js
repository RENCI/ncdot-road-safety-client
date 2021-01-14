import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { api } from '../api'

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
    const fetchAllRoutes = async () => await api.getAllRoutes()
      .then(response => {
        dispatch({ 
          type: 'setRoutes',
          routes: [...response.data.route_ids]
        })
      })
      .catch(error => console.error(error))
    fetchAllRoutes()
  }, [])

  return (
    <RoutesContext.Provider value={{ routes: state, dispatch }}>
      { children }
    </RoutesContext.Provider>
  )
} 

export const useRoutes = () => useContext(RoutesContext)
