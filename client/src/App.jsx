import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserList from "./pages/Users/index";
import NewUser from "./pages/Users/Create";
import EditUser from "./pages/Users/Edit";
import UserProfile from "./pages/Users/Profile";
import Login from "./pages/Login";

import Dashboard from "./pages/Seller/Dashboard";
import Overview from "./pages/Seller/Overview";
import Products from "./pages/Seller/Products";
import CreateProduct from "./pages/Seller/CreateProduct";
import EditProduct from "./pages/Seller/EditProduct";
import Inventory from "./pages/Seller/Inventory";
import Orders from "./pages/Seller/Orders";

import './styles/index.css'
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import { Navigate } from "react-router-dom";

function App() {
  return (
  <Routes>
    {/* AUTH LAYOUT */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/users/create" element={<NewUser />} />
    </Route>

    {/* APP LAYOUT */}
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/login" replace />}
/>
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserProfile />} />
      <Route path="/users/:id/edit" element={<EditUser />} />
    </Route>

    {/* SELLER */}
    <Route path="/seller" element={<Layout />}>
      <Route index element={<Overview />} />

      {/* Products */}
      <Route path="products" element={<Products />} />
      <Route path="products/create" element={<CreateProduct />} />
      <Route path="products/:id/edit" element={<EditProduct />}/>

      {/* Inventory */}
      <Route path="inventory" element={<Inventory />}/>

      {/* Orders */}
      <Route path="orders" element={<Orders />}/> 
    </Route>
  </Routes>
  );
}

export default App;
