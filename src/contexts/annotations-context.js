import React, { createContext, useReducer, useEffect } from "react";

const initialState = [];

const testAnnotations = [
  { id: "label1", label: "guardrail" },
  { id: "label2", label: "driveway" },
  { id: "label3", label: "debris" },
  { id: "label4", label: "sharp curve" }
];

const reducer = (state, action) => {
  switch (action.type) {
    case "setAnnotations": { 
      return [...action.annotations];
    }

    default: 
      throw new Error("Invalid annotations action: " + action.type);
  }
};

export const AnnotationsContext = createContext(initialState);

export const AnnotationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        // XXX: Get from server

        dispatch({ 
          type: "setAnnotations",
          annotations: [...testAnnotations]
        });
      }
      catch (error) {
        console.log(error);
      }
    })();
  }, []);
 
  return (
    <AnnotationsContext.Provider value={ [state, dispatch] }>
      { children }
    </AnnotationsContext.Provider>
  );
}; 
