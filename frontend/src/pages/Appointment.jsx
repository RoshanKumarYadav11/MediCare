import AppointmentForm from "../components/AppointmentForm";

const Appointment = () => {
  return (
    <div className="bg-gradient-to-br from-teal-600 to-blue-500 text-white min-h-screen">
      {/* Introduction Section */}
      <section className="text-center py-16 px-6 relative">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Schedule Your Appointment Today!
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Take the first step towards better health by booking an appointment
            with our expert doctors. We’re here to provide you with the care you
            deserve.
          </p>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section className="py-12 px-6 relative">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto relative z-10">
          <div className="bg-white/10 rounded-lg shadow-lg p-8 backdrop-blur-md max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-12 text-white">
              Book an Appointment
            </h2>
            {/* Appointment Form Component */}
            <AppointmentForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
