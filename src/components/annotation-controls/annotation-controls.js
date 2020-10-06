import React, { useContext, useReducer } from 'react';
import { Space, Select, Tag } from 'antd';
import { AnnotationsContext } from '../../contexts';
import './annotation-controls.css';

const Option = Select.Option;

export const AnnotationControls = () => {
  const [allAnnotations] = useContext(AnnotationsContext);
  const [annotations, annotationsDispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "add": { 
        return state.find(({ id }) => id === action.annotation.id) ? 
          [...state] : [...state, action.annotation];
      }

      case "remove": {
        const index = state.findIndex(({ id }) => id === action.annotation.id);

        if (index === -1) return [...state];

        const newState = [...state];

        newState.splice(index, 1);

        return newState;
      }
  
      default: 
        throw new Error("Invalid action: " + action.type);
    }
  }, []);

  const handleSelectChange = value => {
    const annotation = allAnnotations.find(({ id }) => id === value);

    if (annotation) annotationsDispatch({ type: "add", annotation: annotation });
  }

  const handleTagClose = annotation => {
    annotationsDispatch({ type: "remove", annotation: annotation });
  };

  return (
    <>
      <h3>Annotation Controls</h3>
      <Space direction="vertical">
          <Select
            showSearch
            placeholder="Add an annotation"
            optionFilterProp="children"
            value={null}
            filterOption={ (input, option) => option.props.children.toLowerCase().includes(input.toLowerCase()) }
            onChange={ handleSelectChange }
          >
            { allAnnotations.filter(annotation => (
                !annotations.find(({ id }) => annotation.id === id)
              )).map((annotation, i) => (
                <Option key={ i } value={ annotation.id }>
                  { annotation.label }
                </Option>
              )) 
            }
          </Select>

<div>
          { annotations.map((annotation, i) => (
              <Tag key={ i } closable onClose={ e => { e.preventDefault(); handleTagClose(annotation); }}>{ annotation.label }</Tag>
            )) 
          }
          </div>
     </Space>
    </>
  );
}