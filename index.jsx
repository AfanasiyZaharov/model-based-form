import React, { Component, useEffect, useState } from 'react';
import styled from "styled-components";
import Grades from "./components/Grades";
import Form from "./form-test";

const useInputTestForm = (inputName)=>{
  const [input, setInput] = useState(null);


  const subs = (inputDAta)=>{
    // console.log('uno data', inputDAta);
    console.timeEnd(4321);
    setInput(inputDAta);
  } 
  useEffect(()=>{
    Form.subscribe([inputName], subs);
  }, [])

  return input;
}

// const FormTestHOC = ({inputName}) => (RComponent) => {
//   const [input, setInput] = useInputTestForm(inputName);

//   return <RComponent
//     input={input}
//   />
// }

const TestWrapper = ({inputName, type}) =>{

  const input = useInputTestForm(inputName);
  if(!input) return <>loading...</>
  return <div>
    <input type={type} value={input.value} onChange={(e)=>{ console.time(4321); input.onChange(e.target.value)}} />
  </div>
}

// const CopyCreativeTitleFromFile = FormTestHOC("copyCreativeTitleFromFile")(<input type="checkbox" />);
// const FileName = FormTestHOC("fileName")(<input type="text" />);

class GradesAdminPage extends Component {
  render() {
    return (
      <div>
        <Grades
        />

        <>
          <TestWrapper inputName={"title"} type="text" />
          
        
        </>
      </div>
    );
  }
}

export default GradesAdminPage;