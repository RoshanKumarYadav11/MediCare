// Layout.js


import { Outlet } from "react-router-dom"; // To render nested routes
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Renders the current route */}
      <Footer />
    </>
  );
};

export default Layout;
