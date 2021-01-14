import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  id: null,
  metadata: null,
  annotations: []
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setImage':     
      return {
        id: action.id,
        metadata: action.metadata,
        annotations: action.annotations
      }

    default: 
      throw new Error('Invalid route browser context action: ' + action.type)
  }
}

export const RouteBrowserContext = createContext(initialState)

export const RouteBrowserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
 
  return (
    <RouteBrowserContext.Provider value={ [state, dispatch] }>
      { children }
    </RouteBrowserContext.Provider>
  )
} 

export const useRouteBrowserContext = () => useContext(RouteBrowserContext)
