import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Plus } from "lucide-react";

function Drivers() {

  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license_number: "",
    experience: "",
    address: "",
    license_expiry: ""
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {

      const response = await api.get("/drivers");

      setDrivers(response.data || []);

    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]:
      name === "experience"
        ? Number(value)
        : value,
  });

};
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    if (isEdit) {

      await api.put(`/drivers/${editId}`, formData);

      alert("Driver Updated Successfully!");

    } else {

      await api.post("/drivers", formData);

      alert("Driver Added Successfully!");

    }

    setShowModal(false);

    setIsEdit(false);

    setEditId(null);

    setFormData({
      name: "",
      phone: "",
      license_number: "",
      experience: "",
      address: "",
      license_expiry: ""
    });

    fetchDrivers();

  } catch (error) {

    console.log(error);

  }

};
const handleEdit = (driver) => {

  setFormData({

    name: driver.name,

    phone: driver.phone,

    license_number: driver.license_number,

    experience: driver.experience,

    address: driver.address,

    license_expiry: driver.license_expiry

  });

  setEditId(driver.id);

  setIsEdit(true);

  setShowModal(true);

};
const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this driver?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/drivers/${id}`);

    fetchDrivers();

  } catch (error) {

    console.log(error);

  }

};
const filteredDrivers = drivers.filter((driver) =>
  (driver.name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);
return (
  <MainLayout>

    <div className="flex justify-between items-center mb-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Drivers Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all registered drivers.
        </p>

      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md"
      >
        <Plus size={20} />
        Add Driver
      </button>

    </div>
    <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

  <div className="relative">

    <Search
      size={18}
      className="absolute left-4 top-3.5 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search Driver..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border rounded-xl py-3 pl-11 pr-4"
    />

  </div>

</div>

<div className="bg-white rounded-2xl shadow-md overflow-hidden">

  <div className="flex justify-between items-center p-6 border-b">

    <h2 className="text-xl font-semibold">
      Total Drivers : {filteredDrivers.length}
    </h2>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-gray-100">

        <tr>

          <th className="p-4 text-left">ID</th>

          <th className="p-4 text-left">Name</th>

          <th className="p-4 text-left">Phone</th>

          <th className="p-4 text-left">License</th>

          <th className="p-4 text-left">Experience</th>

          <th className="p-4 text-left">Address</th>

          <th className="p-4 text-left">License Expiry</th>

          <th className="p-4 text-center">Actions</th>

        </tr>

      </thead>

      <tbody>
        {filteredDrivers.length > 0 ? (

  filteredDrivers.map((driver) => (

    <tr key={driver.id} className="border-b hover:bg-blue-50">

      <td className="p-4">{driver.id}</td>

      <td className="p-4">{driver.name}</td>

      <td className="p-4">{driver.phone}</td>

      <td className="p-4">{driver.license_number}</td>

      <td className="p-4">{driver.experience} Years</td>

      <td className="p-4">{driver.address}</td>

      <td className="p-4">
        {driver.license_expiry || "N/A"}
      </td>

      <td className="p-4 text-center">

        <button
          onClick={() => handleEdit(driver)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(driver.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Delete
        </button>

      </td>

    </tr>

  ))

) : (

  <tr>

    <td
      colSpan="8"
      className="text-center py-8 text-gray-500"
    >
      No Drivers Found.
    </td>

  </tr>

)}
      </tbody>
    </table>
  </div>
</div>
{showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          {isEdit ? "Edit Driver" : "Add Driver"}
        </h2>

        <button
          onClick={() => {
            setShowModal(false);
            setIsEdit(false);
            setEditId(null);
          }}
          className="text-2xl"
        >
          ✕
        </button>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-2 gap-5">

          <input
            type="text"
            name="name"
            placeholder="Driver Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="license_number"
            placeholder="License Number"
            value={formData.license_number}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={formData.experience}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="date"
            name="license_expiry"
            value={formData.license_expiry || ""}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-5 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isEdit ? "Update Driver" : "Save Driver"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}
</MainLayout>
);
}

export default Drivers;