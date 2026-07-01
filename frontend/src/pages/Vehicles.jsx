import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Plus } from "lucide-react";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    capacity: "",
    insurance_expiry: "",
    permit_expiry: "",
  });

  useEffect(() => {

    const fetchVehicles = async () => {

      try {

        const response = await api.get("/vehicles");

        console.log(response.data);

        setVehicles(response.data || []);

      } catch (error) {

        console.log(error);

      }

    };

    fetchVehicles();

  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]: name === "capacity" ? Number(value) : value,
  });
};

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isEdit) {
       await api.put(`/vehicles/${editId}`, formData);
      } else {
        await api.post("/vehicles", formData);
      }

      alert("Vehicle Added Successfully!");

      setShowModal(false);

      // data refresh without reload
      const response = await api.get("/vehicles");
      setVehicles(response.data || []);

    } catch (error) {

      console.log(error);

    }   
};

const handleEditClick = (vehicle) => {
  setFormData({
    vehicle_number: vehicle.vehicle_number,
    vehicle_type: vehicle.vehicle_type,
    capacity: vehicle.capacity,
    insurance_expiry: vehicle.insurance_expiry,
    permit_expiry: vehicle.permit_expiry,
  });

  setEditId(vehicle.id);
  setIsEdit(true);
  setShowModal(true);
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");

  if (!confirmDelete) return;

  try {
    await api.delete(`/vehicles/${id}`);

    setVehicles((prev) => prev.filter((v) => v.id !== id));

  } catch (error) {
    console.log(error);
  }
};

   const filteredVehicles = vehicles.filter((vehicle) =>
  (vehicle.vehicle_number || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);
  

  return (
    <MainLayout>

      {/* Page Heading */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Vehicles Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all registered vehicles.
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          <Plus size={20} />
          Add Vehicle
        </button>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>
      {/* Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-xl font-semibold">
            Total Vehicles : {filteredVehicles.length}
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Vehicle Number</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Capacity</th>
                <th className="text-left p-4">Insurance Expiry</th>
                <th className="text-left p-4">Permit Expiry</th>
                <th className="text-center p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredVehicles.length > 0 ? (

                filteredVehicles.map((vehicle) => (

                  <tr
                    key={vehicle.id}
                    className="border-b hover:bg-blue-50 transition duration-200"
                  >

                    <td className="p-4">{vehicle.id}</td>

                    <td className="p-4 font-medium">
                      {vehicle.vehicle_number}
                    </td>

                    <td className="p-4">
                      {vehicle.vehicle_type}
                    </td>

                    <td className="p-4">
                      {vehicle.capacity}
                    </td>

                    <td className="p-4">
                     {new Date(vehicle.insurance_expiry).toLocaleDateString("en-IN")}
                    </td>

                    <td className="p-4">
                      {new Date(vehicle.permit_expiry).toLocaleDateString("en-IN")}
                    </td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() => handleEditClick(vehicle)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"                   >
                        Edit
                        </button>

                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                        Delete
                        </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No Vehicles Found.
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
                {isEdit ? "Edit Vehicle" : "Add Vehicle"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl"
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-2 gap-5">

                <input
                  type="text"
                  name="vehicle_number"
                  placeholder="Vehicle Number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <input
                  type="text"
                  name="vehicle_type"
                  placeholder="Vehicle Type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <input
                  type="date"
                  name="insurance_expiry"
                  value={formData.insurance_expiry}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <input
                  type="date"
                  name="permit_expiry"
                  value={formData.permit_expiry}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Save Vehicle
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </MainLayout>
  );
}

export default Vehicles;