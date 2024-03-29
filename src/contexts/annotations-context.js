import React, { createContext, useReducer, useEffect, useContext } from 'react'
import axios from 'axios'
import { api } from '../api'

const initialState = []

const reducer = (state, action) => {
  switch (action.type) {
    case 'setAnnotations':
      return [...action.annotations]

    default: 
      throw new Error('Invalid annotations context action: ' + action.type)
  }
}

export const AnnotationsContext = createContext(initialState)

export const AnnotationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(api.getAnnotationSet);
                
        dispatch({ 
          type: 'setAnnotations',
          annotations: [...response.data.annotations]
        })        
      }
      catch (error) {
        console.log(error)
      }
    })()
  }, [])
 
  return (
    <AnnotationsContext.Provider value={ [state, dispatch] }>
      { children }
    </AnnotationsContext.Provider>
  )
} 

export const useAnnotations = () => useContext(AnnotationsContext)