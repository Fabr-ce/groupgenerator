import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  DataProvider,
  AppContextProvider,
  OptionsProvider,
} from '../helpers/Context/index';
import Groups from '../Groups';
import Home from '../Home';
import Options from '../Options';
import Students from '../Students';
import Import from '../Import/Import';

export default function Main() {
  return (
    <AppContextProvider>
      <DataProvider>
        <OptionsProvider>
          <Router>
            <Routes>
              <Route path='/options' element={<Options />} />
              <Route path='/students' element={<Students />} />
              <Route path='/groups' element={<Groups />} />
              <Route path='/import/:data' element={<Import />} />
              <Route path='/' element={<Home />} />
            </Routes>
          </Router>
        </OptionsProvider>
      </DataProvider>
    </AppContextProvider>
  );
}
