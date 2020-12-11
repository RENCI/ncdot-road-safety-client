import React, { createContext, useReducer } from 'react'

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
      throw new Error('Invalid image context action: ' + action.type)
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
