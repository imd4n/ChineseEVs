import React, { Fragment } from 'react';
import './App.css';

// components

import InputModel from './components/InputModel';
import ListModels from './components/ListModels';

function App() {
  return (
    <Fragment>
      <div className='container'>
        <InputModel />
        <ListModels />
      </div>
    </Fragment>
  );
}

export default App;
