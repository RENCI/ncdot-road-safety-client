import React, { createContext, useReducer } from 'react'

const initialState = {
  images: []
};
/*
const initialState = {
  id: null,
  metadata: null,
  annotations: []
}
*/

const reducer = (state, action) => {
  switch (action.type) {
    case 'setImage':     
      return {
        id: action.id,
        metadata: action.metadata,
        annotations: action.annotations
      }

    default: 
      throw new Error('Invalid annotation browser context action: ' + action.type)
  }
}

export const AnnotationBrowserContext = createContext(initialState)

export const AnnotationBrowserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
 
  return (
    <AnnotationBrowserContext.Provider value={ [state, dispatch] }>
      { children }
    </AnnotationBrowserContext.Provider>
  )
} 
