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
        metadata: null,
        annotations: null
      }

    case 'setMetadata':
      return {
        ...state, 
        metadata: action.metadata 
      }

    case 'setAnnotations':
      return {
        ...state,
        annotations: action.annotations
      }

    default: 
      throw new Error('Invalid image context action: ' + action.type)
  }
}

export const ImageContext = createContext(initialState)

export const ImageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
 
  return (
    <ImageContext.Provider value={ [state, dispatch] }>
      { children }
    </ImageContext.Provider>
  )
} 
