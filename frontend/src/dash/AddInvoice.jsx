
import { useState } from "react";
import axios from "axios";

const AddInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [services, setServices] = useState([
    { name: "", quantity: 1, rate: 0, total: 0 },
  ]);

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index][field] = value;
    updatedServices[index].total =
      updatedServices[index].quantity * updatedServices[index].rate;
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, { name: "", quantity: 1, rate: 0, total: 0 }]);
  };

  const removeService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = { invoiceNumber, patient, services };

    try {
      const response = await axios.post("http://localhost:4000/api/v1/billing/create", invoiceData);
      alert("Invoice Created Successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Invoice Number:
          <input
            type="text"
            className="border p-2 w-full"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
          />
        </label>

        <h3 className="text-lg font-semibold mt-4">Patient Details</h3>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            className="border p-2 w-full"
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            required
          />
        </label>
        <label className="block mb-2">
          Email:
          <input
            type="email"
            className="border p-2 w-full"
            value={patient.email}
            onChange={(e) => setPatient({ ...patient, email: e.target.value })}
            required
          />
        </label>
        <label className="block mb-2">
          Address:
          <input
            type="text"
            className="border p-2 w-full"
            value={patient.address}
            onChange={(e) => setPatient({ ...patient, address: e.target.value })}
            required
          />
        </label>

        <h3 className="text-lg font-semibold mt-4">Services</h3>
        {services.map((service, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              className="border p-2 flex-1"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleServiceChange(index, "name", e.target.value)}
              required
            />
            <input
              type="number"
              className="border p-2 w-16"
              placeholder="Qty"
              value={service.quantity}
              onChange={(e) => handleServiceChange(index, "quantity", Number(e.target.value))}
              required
            />
            <input
              type="number"
              className="border p-2 w-24"
              placeholder="Rate"
              value={service.rate}
              onChange={(e) => handleServiceChange(index, "rate", Number(e.target.value))}
              required
            />
            <p className="p-2 w-24">Rs. {service.total}</p>
            <button type="button" onClick={() => removeService(index)} className="text-red-500">
              ❌
            </button>
          </div>
        ))}
        <button type="button" onClick={addService} className="bg-blue-500 text-white p-2 mt-2">
          + Add Service
        </button>

        <button type="submit" className="bg-green-500 text-white p-2 mt-4 w-full">
          Create Invoice
        </button>
      </form>
    </div>
  );
};

export default AddInvoice;
