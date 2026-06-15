import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import UserList from "./pages/Users/index";
import NewUser from "./pages/Users/Create";
import EditUser from "./pages/Users/Edit";
import UserProfile from "./pages/Users/Profile";

// Seller
import SellerOverview from "./pages/Seller/Overview";
import Products from "./pages/Seller/Products";
import CreateProduct from "./pages/Seller/CreateProduct";
import EditProduct from "./pages/Seller/EditProduct";
import SellerOrders from "./pages/Seller/Orders";

// Admin
import AdminOverview from "./pages/Admin/Overview";
import AdminUsers from "./pages/Admin/Users";
import AdminOrders from "./pages/Admin/Orders";
import AdminProducts from "./pages/Admin/Products";

// Buyer
import BuyerHome from "./pages/Buyer/Home";
import Shop from "./pages/Buyer/Shop";
import ProductDetail from "./pages/Buyer/ProductDetail";
import Cart from "./pages/Buyer/Cart";
import Checkout from "./pages/Buyer/Checkout";
import About from "./pages/Buyer/About";
import CustomOrder from "./pages/Buyer/CustomOrder";

import Layout from "./components/Layout";
import StorefrontLayout from "./components/StorefrontLayout";
import AuthLayout from "./components/AuthLayout";

import "./styles/index.css";

function App() {
  return (
    <Routes>
      {/* AUTH LAYOUT */}
      <Route element={<AuthLayout />}>
        <Route path="/users/create" element={<NewUser />} />
      </Route>

      {/* APP LAYOUT (dashboard) */}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home-dash" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
      </Route>

      {/* STOREFRONT LAYOUT (buyer) */}
      <Route element={<StorefrontLayout />}>
        <Route path="/home" element={<BuyerHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/custom-order" element={<CustomOrder />} />
      </Route>

      {/* SELLER */}
      <Route path="/seller" element={<Layout />}>
        <Route index element={<SellerOverview />} />
        <Route path="products" element={<Products />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="orders" element={<SellerOrders />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
}

export default App;
