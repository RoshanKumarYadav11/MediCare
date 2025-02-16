import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { isAuthenticated, getRole } from "../utils/auth";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Added role state
  const navigate = useNavigate();

  useEffect(() => {

    const fetchRole = async () => {
      const userRole = await getRole(); // Fetch user role
      setRole(userRole);

      // Check if user is authenticated and has a valid role ('Patient', 'Doctor', or 'Admin')
      const loggedIn =
        isAuthenticated() &&
        (userRole === "Patient" ||
          userRole === "Doctor" ||
          userRole === "Admin");
      setIsLoggedIn(loggedIn);
    };

    fetchRole();
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    setIsLoggedIn(false);
    setRole(null); // Clear role
    navigate("/"); // Redirect to home page
  };

  const handleAppointmentClick = () => {
    if (isLoggedIn) {
      navigate("/appointment");
    } else {
      navigate("/login");
    }
  };
console.log()
  // Navigation items for patients
  const navItems = [
    { id: 1, text: "Home", path: "/" },
    { id: 2, text: "About", path: "/about" },
    ...(isLoggedIn && role === "Patient"
      ? [{ id: 3, text: "Dashboard", path: "/dashboard" }]
      : []),
  ];

  

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 flex justify-between items-center h-24 max-w-full mx-auto px-4 text-white">
      {/* Logo */}
      <div className="logo">
        <img src="/logo.png" alt="logo" className="h-20 w-20 object-cover" />
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black"
          >
            <Link to={item.path}>{item.text}</Link>
          </li>
        ))}
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex p-4 space-x-5">
        <button
          className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164]"
          onClick={handleAppointmentClick}
        >
          Book An Appointment
        </button>
        {isLoggedIn ? (
          <button
            className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164]"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164]">
            <Link to="/login">Login</Link>
          </button>
        )}
      </div>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 z-50"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        {/* Mobile Logo */}
        <div className="logo">
          <img src="/logo.png" alt="logo" className="h-20 w-20 object-cover" />
        </div>

        {/* Mobile Navigation Items */}
        {navItems.map((item) => (
          <li
            key={item.id}
            className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600"
          >
            <Link to={item.path} onClick={() => setNav(false)}>
              {item.text}
            </Link>
          </li>
        ))}

        {/* Mobile Buttons */}
        <li className="p-4 space-y-4">
          <button
            className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164] w-full"
            onClick={() => {
              handleAppointmentClick();
              setNav(false);
            }}
          >
            Book An Appointment
          </button>
          {isLoggedIn ? (
            <button
              className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164] w-full"
              onClick={() => {
                handleLogout();
                setNav(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="bg-[#00df9a] text-white px-4 py-2 rounded-md hover:bg-[#248164] w-full"
              onClick={() => setNav(false)}
            >
              <Link to="/login">Login</Link>
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
