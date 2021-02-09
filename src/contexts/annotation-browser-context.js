import React, { createContext, useReducer } from 'react'

const initialState = {
  images: [],
  nextImages: [],
  oldImages: [],
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
    },
    flag: false,
    comment: ''
  }
}

const reducer = (state, action) => {
  switch (action.type) {    

    case 'clearImages':
      return {
        ...state, 
        images: [],
        nextImages: [],
        oldImages: []
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
        nextImages: state.nextImages.slice(state.numLoad),
        oldImages: [...state.images]
      }

    case 'goBack':
      return {
        ...state,
        images: [...state.oldImages],
        nextImages: state.images.concat(state.nextImages.slice(0, -state.numLoad)),
        oldImages: []
      }

    case 'addImage': {     
      const image = createImage(action.id)

      image.metadata = action.metadata
      image.annotations = action.annotations

      return {
        ...state,
        images: [...state.images, image]        
      }      
    } 

    case 'setAnnotationPresent': {

      console.log(state)
      console.log(action)

      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      console.log(image)

      if (image) {
        image.present[action.view] = action.present
      }

      return newState
    }

    case 'setFlag': {
      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      if (image) {
        image.flag = action.flag
      }

      return newState
    }

    case 'setComment': {
      const newState = {...state}

      const image = newState.images.find(({ id }) => id === action.id)

      if (image) {
        image.comment = action.comment
      }

      return newState
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
