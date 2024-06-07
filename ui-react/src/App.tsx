import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Contributions from "./components/contributions/Contributions";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path='/contributions' element={<Contributions />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
