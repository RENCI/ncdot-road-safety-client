import React, { createContext, useReducer } from 'react'

const initialState = {
  images: [],
  nextImages: [],
  numLoad: 5,
  annotation: null
};

const createImage = id => {
  return {
    id: id,
    metadata: {},
    annotations: [],
    present: {
      left: false,
      front: false,
      right: false
    }
  }
}

const reducer = (state, action) => {
  switch (action.type) {    

    case 'clearImages':
      return {
        ...state, 
        images: [],
        nextImages: []
      }

    case 'setImages':
      return {
        ...state,
        images: action.ids.map(createImage)
      }

    case 'addNextImages':
      return {
        ...state,
        nextImages: state.nextImages.concat(action.ids.map(createImage))        
      }

    case 'updateImages':
      return {
        ...state,
        images: state.nextImages.slice(0, state.numLoad),
        nextImages: state.nextImages.slice(state.numLoad)
      }

    case 'addImage':     
      return {
        ...state,
        images: [
          ...state.images, {
            id: action.id,
            metadata: action.metadata,
            annotations: action.annotations,
            present: {
              left: false,
              front: false,
              right: false
            }
          }
        ]        
      }       

    case 'toggleAnnotationPresent': {
      const index = state.images.findIndex(({ id }) => id === action.id)

      if (index === -1) return {...state}

      const newImages = [...state.images]

      const present = {...newImages[index].present}
      present[action.which] = !present[action.which]

      newImages[index] = {
        ...newImages[index],
        present: present
      }

      return {
        ...state, 
        images: newImages
      }
    }

    case 'setNumLoad':
      return {
        ...state,
        numLoad: action.numLoad
      } 

    case 'setAnnotation':
      return {
        ...state,
        annotation: action.annotation,        
        nextImages: []
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
