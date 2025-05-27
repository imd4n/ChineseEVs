import React, { Fragment } from 'react';
import './App.css';

// components

// InputModel is now rendered within ListModels
// import InputModel from './components/InputModel'; 
import ListModels from './components/ListModels';

function App() {
  return (
    <Fragment>
      <div className='container'>
        {/* <InputModel /> Removed as it is now part of ListModels header */}
        <ListModels />
      </div>
    </Fragment>
  );
}

export default App;
