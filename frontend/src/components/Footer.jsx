import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    {
      id: 1,
      day: "Monday",
      time: "9:00 AM - 11:00 PM",
    },
    {
      id: 6,
      day: "Saturday",
      time: "9:00 AM - 3:00 PM",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-start">
            <img src="/logo.png" alt="logo" className="w-32 mb-4" />
            <p className="text-sm text-gray-300">
              Your trusted healthcare partner delivering care and compassion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-green-400 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/appointment"
                  className="hover:text-green-400 transition duration-300"
                >
                  Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-400 transition duration-300"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Hours</h4>
            <ul className="space-y-2">
              {hours.map((element) => (
                <li key={element.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">{element.day}</span>
                  <span className="text-gray-100">{element.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Contact</h4>
            <div className="flex items-center mb-2 text-sm">
              <FaPhone className="text-green-400 mr-2" />
              <span>+977 123 456 789</span>
            </div>
            <div className="flex items-center mb-2 text-sm">
              <MdEmail className="text-green-400 mr-2" />
              <span>info@medicare.com</span>
            </div>
            <div className="flex items-center text-sm">
              <FaLocationArrow className="text-green-400 mr-2" />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-8 border-t pt-6 text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Medicare. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
