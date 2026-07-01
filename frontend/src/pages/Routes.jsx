import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Search, Plus } from "lucide-react";

function Routes() {

  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    route_name: "",
    source: "",
    destination: "",
    distance: ""
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {

    try {

      const response = await api.get("/routes");

      setRoutes(response.data || []);

    } catch (error) {

      console.log(error);

    }

  };
  const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]:
      name === "distance"
        ? Number(value)
        : value,
  });

};
const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    if (isEdit) {

      await api.put(`/routes/${editId}`, formData);

      alert("Route Updated Successfully!");

    } else {

      await api.post("/routes", formData);

      alert("Route Added Successfully!");

    }

    setShowModal(false);

    setIsEdit(false);

    setEditId(null);

    setFormData({
      route_name: "",
      source: "",
      destination: "",
      distance: ""
    });

    fetchRoutes();

  } catch (error) {

    console.log(error);

  }

};
const handleEdit = (route) => {

  setFormData({

    route_name: route.route_name,

    source: route.source,

    destination: route.destination,

    distance: route.distance

  });

  setEditId(route.id);

  setIsEdit(true);

  setShowModal(true);

};
const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this route?"
  );

  if (!confirmDelete) return;

  try {

    await api.delete(`/routes/${id}`);

    fetchRoutes();

  } catch (error) {

    console.log(error);

  }

};
const filteredRoutes = routes.filter((route) =>
  (route.route_name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);
return (
  <MainLayout>

    <div className="flex justify-between items-center mb-8">

      <div>

        <h1 className="text-3xl font-bold text-gray-800">
          Routes Management
        </h1>

        <p className="text-gray-500 mt-1">
          Manage all transport routes.
        </p>

      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md"
      >
        <Plus size={20} />
        Add Route
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
      placeholder="Search Route..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border rounded-xl py-3 pl-11 pr-4"
    />

  </div>

</div>
<div className="bg-white rounded-2xl shadow-md overflow-hidden">

  <div className="flex justify-between items-center p-6 border-b">

    <h2 className="text-xl font-semibold">
      Total Routes : {filteredRoutes.length}
    </h2>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead className="bg-gray-100">

        <tr>

          <th className="p-4 text-left">ID</th>

          <th className="p-4 text-left">Route Name</th>

          <th className="p-4 text-left">Source</th>

          <th className="p-4 text-left">Destination</th>

          <th className="p-4 text-left">Distance</th>

          <th className="p-4 text-center">Actions</th>

        </tr>

      </thead>

      <tbody>
        {filteredRoutes.length > 0 ? (

  filteredRoutes.map((route) => (

    <tr key={route.id} className="border-b hover:bg-blue-50">

      <td className="p-4">{route.id}</td>

      <td className="p-4 font-medium">
        {route.route_name}
      </td>

      <td className="p-4">
        {route.source}
      </td>

      <td className="p-4">
        {route.destination}
      </td>

      <td className="p-4">
        {route.distance} KM
      </td>

      <td className="p-4 text-center">

        <button
          onClick={() => handleEdit(route)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg mr-2"
        >
          Edit
        </button>

        <button
          onClick={() => handleDelete(route.id)}
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
      colSpan="6"
      className="text-center py-8 text-gray-500"
    >
      No Routes Found.
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
          {isEdit ? "Edit Route" : "Add Route"}
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
            name="route_name"
            placeholder="Route Name"
            value={formData.route_name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="source"
            placeholder="Source"
            value={formData.source}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="distance"
            placeholder="Distance (KM)"
            value={formData.distance}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
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
            {isEdit ? "Update Route" : "Save Route"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}
</MainLayout>
);
}

export default Routes;