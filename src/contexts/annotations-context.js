import React, { createContext, useReducer, useEffect } from "react";

const initialState = [];

const testLabels = [
  "guardrail", "driveway", "debris", "sharp curve", "tree", "sign"
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
        const annotations = testLabels.map((label, i) => {
          return {
            id: "label" + i,
            label: label
          };
        });

        dispatch({ 
          type: "setAnnotations",
          annotations: [...annotations]
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
