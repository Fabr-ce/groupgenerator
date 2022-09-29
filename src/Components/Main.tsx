import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import Groups from './Groups';
import Home from './Home';
import { AppContextProvider } from './IndexdbContext';
import Options from './Options';
import { OptionsProvider } from './OptionsContext';
import Students from './Students';

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
              <Route path='/' element={<Home />} />
            </Routes>
          </Router>
        </OptionsProvider>
      </DataProvider>
    </AppContextProvider>
  );
}
