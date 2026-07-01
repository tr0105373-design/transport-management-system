import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Fees() {

  const [fees, setFees] = useState([]);

  const [search, setSearch] = useState("");

  const [students, setStudents] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
  student_id: "",
  amount: "",
  due_date: ""
});

useEffect(() => {

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  fetchFees();
  fetchStudents();

}, []);

  const fetchFees = async () => {
    try {
      const res = await api.get("/fees");
      setFees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStudents = async () => {

  try {

    const res = await api.get("/students");

    setStudents(res.data.students);

  } catch (error) {

    console.log(error);

  }

};

  const markAsPaid = async (id) => {
  try {

    await api.put(`/fees/${id}`);

    fetchFees();

  } catch (error) {

    console.log(error);

  }
};

const deleteFee = async (id) => {

  if (!window.confirm("Delete this fee?")) return;

  try {

    await api.delete(`/fees/${id}`);

    fetchFees();

  } catch (error) {

    console.log(error);

  }
};

const payNow = async (fee) => {

  try {

    const { data } = await api.post("/payment/create-order", {
      amount: fee.amount
    });

    const options = {
      key: "rzp_test_T87IRyyMB3U5ck",
      amount: data.amount,
      currency: data.currency,
      name: "Transport Management System",
      description: "Transport Fee Payment",
      order_id: data.id,

      handler: async function () {

        await api.put(`/fees/${fee.id}`);

        fetchFees();

        alert("Payment Successful");

      }

    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();

  } catch (error) {

    console.log(error);

  }

};

const saveFee = async () => {
  try {

    await api.post("/fees", formData);

    fetchFees();

    setShowForm(false);

    setFormData({
      student_id: "",
      amount: "",
      due_date: ""
    });

  } catch (error) {

    console.log(error);

    alert(error.response?.data?.message || "Failed to save fee");

  }
};

  return (
    <MainLayout>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Transport Fee Management
        </h1>

        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-3 w-80 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          + Add Fee
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">Student</th>

              <th className="p-4 text-left">Amount</th>

              <th className="p-4 text-left">Due Date</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {fees
              .filter((fee) =>
               fee.student_name
                .toLowerCase()
                 .includes(search.toLowerCase())
              )
              .map((fee) => (

              <tr
                key={fee.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {fee.student_name}
                </td>

                <td className="p-4">
                  ₹{Number(fee.amount).toLocaleString("en-IN")}
                </td>

                <td className="p-4">
                  {new Date(fee.due_date).toLocaleDateString("en-IN")}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      fee.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {fee.status}
                  </span>

                </td>

                <td className="p-4 text-center">
                 
                <button
                 onClick={() => payNow(fee)}
                 className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg mr-2"
                >
                 Pay Now
                </button>


               <button
                 onClick={() => deleteFee(fee.id)}
                 className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
               >
                 Delete
              </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showForm && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

  <div className="bg-white rounded-2xl p-6 w-[420px]">

    <h2 className="text-2xl font-bold mb-5">
      Add Transport Fee
    </h2>

    <select
      value={formData.student_id}
      onChange={(e)=>
        setFormData({
          ...formData,
          student_id:e.target.value
        })
      }
      className="w-full border rounded-lg p-3 mb-4"
    >

      <option value="">
        Select Student
      </option>

      {students.map((student)=>(
        <option
          key={student.id}
          value={student.id}
        >
          {student.student_name}
        </option>
      ))}

    </select>

    <input
      type="number"
      placeholder="Amount"
      value={formData.amount}
      onChange={(e)=>
        setFormData({
          ...formData,
          amount:e.target.value
        })
      }
      className="w-full border rounded-lg p-3 mb-4"
    />

    <input
      type="date"
      value={formData.due_date}
      onChange={(e)=>
        setFormData({
          ...formData,
          due_date:e.target.value
        })
      }
      className="w-full border rounded-lg p-3 mb-5"
    />

    <div className="flex justify-end gap-3">

      <button
        onClick={()=>setShowForm(false)}
        className="px-5 py-2 rounded-lg bg-gray-300"
      >
        Cancel
      </button>

      <button
       onClick={saveFee}
      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        Save Fee
     </button>

    </div>

  </div>

</div>

)}

    </MainLayout>
  );
}

export default Fees;