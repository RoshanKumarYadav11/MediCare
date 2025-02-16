const Invoice = () => {
  const services = [
    {
      name: "Appointment Booking",
      quantity: 1,
      rate: 700.0,
      total: 700.0,
    },
    {
      name: "X-ray",
      quantity: 1,
      rate: 400.0,
      total: 400.0,
    },
    {
      name: "Urine Test",
      quantity: 1,
      rate: 100.0,
      total: 100.0,
    },
  ];
  const sum = services.reduce((acc, curr) => acc + curr.total, 0);
  const taxable = (sum * 13) / 100;
  const total = sum + taxable;

  return (
    <>
      <div
        className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-sm my-6"
        id="invoice"
      >
        <div className="grid grid-cols-3 items-center">
          <div>
            {/*  Company logo  */}
            <img src="/logo.png" alt="company-logo" height={100} width={100} />
          </div>
          <h2 className="font-bold text-3xl text-center">INVOICE</h2>
          <div className="text-right">
            <p>Medicare Inc.</p>
            <p className="text-gray-500 text-sm mt-1">VAT: 8657671212</p>
          </div>
        </div>
        {/* Client info */}
        <div className="grid grid-cols-2 items-center mt-8">
          <div>
            <p className="font-bold text-gray-800">
              Bill to : <span>Patient</span>
            </p>
            <p className="text-gray-500">Kathmandu,Nepal</p>
            <p className="text-gray-500">patient@gmail.com</p>
          </div>
          <div className="text-right">
            <p className>
              Invoice number:
              <span className="text-gray-500">INV-2025786123</span>
            </p>
            <p>
              Invoice date: <span className="text-gray-500">03/07/2025</span>
            </p>
          </div>
        </div>
        {/* Invoice Items */}
        <div className="-mx-4 mt-8 flow-root sm:mx-0">
          <table className="min-w-full">
            <colgroup>
              <col className="w-full sm:w-1/2" />
              <col className="sm:w-1/6" />
              <col className="sm:w-1/6" />
              <col className="sm:w-1/6" />
            </colgroup>
            <thead className="border-b border-gray-300 text-gray-900">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="font-medium text-gray-900">
                      {service.name}
                    </div>
                  </td>
                  <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                    {service.quantity}
                  </td>
                  <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                    Rs.{service.rate}
                  </td>
                  <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                    Rs.{service.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Subtotal
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Subtotal
                </th>
                <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                  Rs{sum}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Tax 13%
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Tax 13%
                </th>
                <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                  Rs.{taxable}
                </td>
              </tr>
              {/* <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                >
                  Discount
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Discount
                </th>
                <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                  - 10%
                </td>
              </tr> */}
              <tr>
                <th
                  scope="row"
                  colSpan={3}
                  className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                >
                  Total
                </th>
                <th
                  scope="row"
                  className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                >
                  Total
                </th>
                <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                  Rs.{total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default Invoice;