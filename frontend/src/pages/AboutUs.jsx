const AboutUs = () => {
    const features = [
      {
        id: 1,
        title: "Expert Team",
        description: "Our team comprises highly skilled professionals committed to providing top-notch healthcare services.",
        icon: "👩‍⚕️",
      },
      {
        id: 2,
        title: "Personalized Care",
        description: "We tailor our treatments to meet individual patient needs for a better and healthier outcome.",
        icon: "💖",
      },
      {
        id: 3,
        title: "Cutting-Edge Facilities",
        description: "We use advanced technology and modern facilities to ensure the highest quality care.",
        icon: "🏥",
      },
    ];
  
    return (
      <div className="text-white">
        {/* Hero Section */}
        {/* <section className="relative py-20 text-center bg-gradient-to-br from-teal-600 to-blue-500">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Dedicated to providing exceptional healthcare with compassion, innovation, and excellence.
            </p>
          </div>
        </section> */}
  
        {/* Merged Content Section with Image */}
        <section className="py-12 px-6 bg-gray-100 text-gray-800">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            {/* Text Content */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Who We Are
              </h2>
              <p className="text-lg leading-relaxed mb-4">
                At <span className="text-teal-600 font-semibold">MediCare</span>, we are passionate about transforming healthcare. 
                Our team combines expertise, compassion, and advanced technology to deliver personalized and exceptional care for every patient.
              </p>
              <p className="text-lg leading-relaxed">
                From routine checkups to specialized treatments, we are here to support your health journey and provide a seamless experience tailored to your needs.
              </p>
            </div>
            {/* Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/about/about.png"
                alt="About Us"
                className="rounded-lg  object-cover w-full "
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 px-6 bg-gradient-to-br from-teal-600 to-blue-500 text-white">
  <div className="absolute inset-0 bg-black opacity-50"></div>
  <div className="container mx-auto relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
      Why Choose Us?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <div className="text-5xl mb-4 text-green-400">{feature.icon}</div>
          <h3 className="text-2xl font-semibold mb-2 text-white">
            {feature.title}
          </h3>
          <p className="text-gray-300">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
        </section>
  
        {/* Call-to-Action Section with Fixed Background */}
        <section
          className="relative py-24 text-center bg-fixed bg-cover bg-center"
          style={{ backgroundImage: "url('/about/background.png')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Exceptional Care?
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-200">
              Join us on our mission to transform healthcare. Schedule your appointment today and let us serve you better.
            </p>
            <a
              href="/appointment"
              className="inline-block bg-[#00df9a] hover:bg-[#248164] text-white text-lg font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Book an Appointment
            </a>
          </div>
        </section>
  
       
 

      </div>
    );
  };
  
  export default AboutUs;
  