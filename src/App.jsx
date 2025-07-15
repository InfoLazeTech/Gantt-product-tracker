import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout ';
import Process from './Pages/Process';
import Recipe from './Pages/Recipe';
import PODetail from './Pages/PODetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route index element={<Navigate to="process" />} />
          <Route path="process" element={<Process />} />
          <Route path="recipe" element={<Recipe />} />
          <Route path="po-detail" element={<PODetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
