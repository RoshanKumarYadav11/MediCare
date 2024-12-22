const services = [
  {
    title: "Outpatient Services",
    description: "Comprehensive care for all your outpatient needs.",
    icon: "https://cdn-icons-png.flaticon.com/512/3061/3061306.png",
  },
  {
    title: "Diagnostic Imaging",
    description: "Advanced imaging for accurate diagnosis.",
    icon: "https://cdn-icons-png.flaticon.com/512/2554/2554940.png",
  },
  {
    title: "Emergency Care",
    description: "24/7 emergency services to handle critical conditions.",
    icon: "https://cdn-icons-png.flaticon.com/512/1483/1483925.png",
  },
  {
    title: "Specialized Clinics",
    description: "Expert care in pediatrics, cardiology, and more.",
    icon: "https://cdn-icons-png.flaticon.com/512/3061/3061338.png",
  },
];

const Services = () => {
  return (
    <section className="pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Services</h2>
          <p className="mt-4 text-gray-600">
            Explore the comprehensive medical services we offer to ensure your well-being.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4">
                <img src={service.icon} alt={service.title} className="w-full h-full object-contain" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-800 text-center">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mt-2 text-center">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Button */}
        {/* <div className="text-center mt-12">
          <button className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors">
            View All Services
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Services;
