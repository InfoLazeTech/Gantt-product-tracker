import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Process from "./Pages/Process";
import Recipe from "./Pages/Recipe";
import PODetail from "./Pages/PODetail";
import NewPo from "./Pages/NewPo";
import Login from "./components/Auth/Login";
import POFilter from "./publicLayouts/PoFilter";
import SidebarLayout from "./layouts/SidebarLayout ";

function App() {
  return (
    <Routes>
      <Route path="/" element={<POFilter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<SidebarLayout />}>
        <Route index element={<Navigate to="process" />} />
        <Route path="process" element={<Process />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="newpo" element={<NewPo />} />
        <Route path="po-detail" element={<PODetail />} />
      </Route>
    </Routes>
  );
}

export default App;
