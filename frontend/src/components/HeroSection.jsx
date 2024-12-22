import { FaRegStar, FaShieldAlt, FaHeadset } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-teal-600 to-blue-500 text-white overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
      ></div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Side: Welcome Text */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Excellence in Care, <br /> Built for You.
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Simplifying healthcare with a management system tailored to ensure
              top-notch care and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#"
                className="bg-white text-teal-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition duration-300 text-center"
              >
                Learn More
              </a>
              <a
                href="#"
                className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-teal-600 transition duration-300 text-center"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right Side: Features */}
          <div className="w-full md:w-1/2 md:pl-12">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaRegStar className="w-6 h-6 mr-3 text-yellow-400" />
                  <span>Streamlined Appointment Management</span>
                </li>
                <li className="flex items-center">
                  <FaShieldAlt className="w-6 h-6 mr-3 text-green-400" />
                  <span>Secure and Scalable Solutions</span>
                </li>
                <li className="flex items-center">
                  <FaHeadset className="w-6 h-6 mr-3 text-purple-400" />
                  <span>24/7 Patient Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
