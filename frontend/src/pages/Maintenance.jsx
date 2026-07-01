import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Plus } from "lucide-react";

function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
  vehicle_id: "",
  last_service: "",
  next_service: "",
  cost: "",
  status: "Pending",
  remarks: "",
});

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const maintenanceRes = await api.get("/maintenance");
      setMaintenance(maintenanceRes.data || []);

      const vehicleRes = await api.get("/vehicles");
      setVehicles(vehicleRes.data || []);

      const driverRes = await api.get("/drivers");
      setDrivers(driverRes.data || []);

      const routeRes = await api.get("/routes");
      setRoutes(routeRes.data || []);
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleEdit = (item) => {

  setEditingId(item.id);

  setFormData({
    vehicle_id: item.vehicle_id || "",
    last_service: item.last_service || "",
    next_service: item.next_service || "",
    cost: item.cost || "",
    status: item.status || "Pending",
    remarks: item.remarks || "",
  });

  setShowModal(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/maintenance/${editingId}`, formData) ;
        alert("Maintenance Updated Successfully");
      } else {
        await api.post("/maintenance", formData) ;
        alert("Maintenance Added Successfully");
      }

    setFormData({
      vehicle_id: "",
      last_service: "",
      next_service: "",
      cost: "",
      status: "Pending",
      remarks: "",
    });

      setEditingId(null);
      setShowModal(false);

      fetchMaintenance();
    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this maintenance record?")) return;

    try {
      await api.delete(`/maintenance/${id}`) ;
      alert("Maintenance  Deleted Successfully");
      fetchMaintenance();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const filteredMaintenance = maintenance.filter((item) =>
  item.vehicle_number?.toLowerCase().includes(search.toLowerCase())
);

  return (
  <MainLayout>

    {/* Header */}
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Maintenance  Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all registered maintenance records.
        </p>
      </div>

      <button
        onClick={() => {
          setEditingId(null);

          setFormData({
             vehicle_id: "",
             last_service: "",
             next_service: "",
             cost: "",
             status: "Pending",
             remarks: "",
          });

          setShowModal(true);
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
      >
        <Plus size={20} />
        Add Maintenance
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
          placeholder="Search Vehicle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl py-3 pl-11 pr-4"
        />

      </div>

    </div>

    {/* Table */}

    <div className="bg-white rounded-2xl shadow-md overflow-hidden">

      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          Total Maintenance : {filteredMaintenance.length}
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Last Service</th>
              <th className="p-4 text-left">Next Service</th>
              <th className="p-4 text-left">Cost</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Remarks</th>

            </tr>

          </thead>

          <tbody>

            {filteredMaintenance.length > 0 ? (

              filteredMaintenance.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-blue-50"
                >


                  <td className="p-4 font-medium">
                    {item.vehicle_number}
                  </td>

                 <td>{new Date(item.last_service).toLocaleDateString("en-GB")}</td>

                 <td>{new Date(item.next_service).toLocaleDateString("en-GB")}</td>

                  <td>₹ {item.cost}</td>

                  <td>{item.status}</td>

                  <td>{item.remarks}</td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
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
                  colSpan="9"
                  className="text-center py-10 text-gray-500"
                >
                  No Maintenance Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
    {/* Add / Edit Maintenance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Maintenance" : "Add Maintenance"}
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

               

                {/* Vehicle */}
                <select
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                >
                  <option value="">Select Vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.vehicle_number}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  name="last_service"
                  value={formData.last_service}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                 <input
                   type="date"
                   name="next_service"
                   value={formData.next_service}
                   onChange={handleChange}
                   className="border rounded-lg p-3"
                   required
                />

                <input
                  type="number"
                  name="cost"
                  placeholder="Service Cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <select
                   name="status"
                   value={formData.status}
                   onChange={handleChange}
                   className="border rounded-lg p-3"
                  >
               <option value="Pending">Pending</option>
               <option value="Completed">Completed</option>
                </select>

                <textarea
                   name="remarks"
                   placeholder="Remarks"
                   value={formData.remarks}
                   onChange={handleChange}
                   className="border rounded-lg p-3 col-span-2"
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
                  {editingId ? "Update Maintenance" : "Save Maintenance"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </MainLayout>
  );
}

export default Maintenance;