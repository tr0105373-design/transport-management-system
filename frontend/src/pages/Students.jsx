import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Plus } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    student_name: "",
    class: "",
    phone: "",
    pickup_point: "",
    vehicle_id: "",
    driver_id: "",
    route_id: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentRes = await api.get("/students");
      setStudents(studentRes.data.students || []);

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

  const handleEdit = (student) => {
    setEditingId(student.id);

    setFormData({
      student_name: student.student_name || "",
      class: student.class || "",
      phone: student.phone || "",
      pickup_point: student.pickup_point || "",
      vehicle_id: student.vehicle_id || "",
      driver_id: student.driver_id || "",
      route_id: student.route_id || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
        alert("Student Updated Successfully");
      } else {
        await api.post("/students", formData);
        alert("Student Added Successfully");
      }

      setFormData({
        student_name: "",
        class: "",
        phone: "",
        pickup_point: "",
        vehicle_id: "",
        driver_id: "",
        route_id: "",
      });

      setEditingId(null);
      setShowModal(false);

      fetchStudents();
    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      alert("Student Deleted Successfully");
      fetchStudents();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.student_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );
  return (
  <MainLayout>

    {/* Header */}
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Students Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all registered students.
        </p>
      </div>

      <button
        onClick={() => {
          setEditingId(null);

          setFormData({
            student_name: "",
            class: "",
            phone: "",
            pickup_point: "",
            vehicle_id: "",
            driver_id: "",
            route_id: "",
          });

          setShowModal(true);
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
      >
        <Plus size={20} />
        Add Student
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
          placeholder="Search Student..."
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
          Total Students : {filteredStudents.length}
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Class</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Pickup</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Driver</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length > 0 ? (

              filteredStudents.map((student) => (

                <tr
                  key={student.id}
                  className="border-b hover:bg-blue-50"
                >

                  <td className="p-4">{student.id}</td>

                  <td className="p-4 font-medium">
                    {student.student_name}
                  </td>

                  <td className="p-4">
                    {student.class}
                  </td>

                  <td className="p-4">
                    {student.phone}
                  </td>

                  <td className="p-4">
                    {student.pickup_point}
                  </td>

                  <td className="p-4">
                    {student.vehicle_number}
                  </td>

                  <td className="p-4">
                    {student.driver_name}
                  </td>

                  <td className="p-4">
                    {student.route_name}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
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
                  No Students Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
    {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Student" : "Add Student"}
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
                  name="student_name"
                  placeholder="Student Name"
                  value={formData.student_name}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

                <input
                  type="text"
                  name="class"
                  placeholder="Class"
                  value={formData.class}
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
                  name="pickup_point"
                  placeholder="Pickup Point"
                  value={formData.pickup_point}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                />

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

                {/* Driver */}
                <select
                  name="driver_id"
                  value={formData.driver_id}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                >
                  <option value="">Select Driver</option>

                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>

                {/* Route */}
                <select
                  name="route_id"
                  value={formData.route_id}
                  onChange={handleChange}
                  className="border rounded-lg p-3"
                  required
                >
                  <option value="">Select Route</option>

                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.route_name}
                    </option>
                  ))}
                </select>

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
                  {editingId ? "Update Student" : "Save Student"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </MainLayout>
  );
}

export default Students;