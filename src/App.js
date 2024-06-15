import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
