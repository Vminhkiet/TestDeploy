import React from "react";
import './App.css'
import {BrowserRouter, Routes, Route, Outlet} from 'react-router-dom'

import Login from './Pages/Login/Login.jsx';
import Register from './Pages/Register/Register.jsx';
import DashBoard from "./Pages/DashBoard/DashBoard.jsx";
import Navbar from "./Component/Navbar/Navbar.jsx";
import Inventory from "./Pages/Inventory/Inventory.jsx";
import Category from "./Pages/Category/Category.jsx";
import Product from "./Pages/Product/Product.jsx";
import Header from "./Layouts/Header";
import { Box } from "@mui/material";

const Layout = () => (
  <>
    <Box sx={{ display: 'flex' }}>
      <Header />  
      <Navbar /> 
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          ml: '0',
          mt: '6.5vh',
          overflowY: "auto",
        }}
      >
        <Outlet/>
      </Box>
    </Box>
  </>
);

import Employee from "./Pages/Employee/Employee.jsx";
import Shelf from "./Pages/Shelf/Shelf.jsx";
const App = () =>{
  return(
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='app' element={<Layout/>}>
            <Route path='home' element={<DashBoard/>}/>
            <Route path='inventory' element={<Inventory/>}/>
            <Route path='category' element={<Category/>}/>
            <Route path='product' element={<Product/>}/>
            <Route path='employee' element={<Employee/>}/>
            <Route path='shelf' element={<Shelf/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App