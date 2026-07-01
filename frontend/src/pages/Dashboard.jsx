import MainLayout from "../layouts/MainLayout";
import { Users, Bus, UserCircle, Bell } from "lucide-react";
import ChartSection from "../components/ChartSection";
import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

function Dashboard() {

  // Dashboard Counts
  const [studentsCount, setStudentsCount] = useState(0);
  const [vehiclesCount, setVehiclesCount] = useState(0);
  const [driversCount, setDriversCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);

  // Live Data
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      // Students
      const studentsRes = await api.get("/students");
      setStudentsCount(studentsRes.data.students.length);

      // Vehicles
      const vehiclesRes = await api.get("/vehicles");
      setVehiclesCount(vehiclesRes.data.length);

      // Drivers
      const driversRes = await api.get("/drivers");
      setDriversCount(driversRes.data.length);

      // Routes
      const routesRes = await api.get("/routes");
      setRoutesCount(routesRes.data.length);

      // Activities
      const activityRes = await api.get("/activity");
      setActivities(activityRes.data);

      // Alerts
      const alertsRes = await api.get("/alerts");

      setAlerts(alertsRes.data);
      setAlertsCount(alertsRes.data.length);
    } catch (error) {

      console.log(error);

    }

  };

  return (

    <MainLayout>

      <div className="p-6">

      <div className="flex justify-between items-center mb-8">

  <h1 className="text-3xl font-bold text-gray-800">
    Admin Dashboard
  </h1>

 <button
  onClick={() => {
    window.open("http://localhost:5000/api/export/csv", "_blank");
    toast.success("Report downloaded successfully!");
  }}
  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg transition-all duration-300"
>
  <Download size={18} />
  Export Report
</button>

</div>

      {/* Welcome Banner */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-lg mb-8">

        <h1 className="text-3xl font-bold">
          Welcome, System Administrator
        </h1>

        <p className="mt-2 text-blue-100">
          Manage students, vehicles, drivers and routes efficiently.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>
            <h2 className="text-2xl font-bold">{studentsCount}</h2>
            <p className="text-blue-100">Students</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{vehiclesCount}</h2>
            <p className="text-blue-100">Vehicles</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{driversCount}</h2>
            <p className="text-blue-100">Drivers</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{routesCount}</h2>
            <p className="text-blue-100">Routes</p>
          </div>

        </div>

      </div>

      {/* Top Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6">

          <Users size={35} className="text-blue-600 mb-3"/>

          <h2 className="text-gray-500 text-lg">
            Students
          </h2>

          <p className="text-3xl font-bold">
            {studentsCount}
          </p>

        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6">

          <Bus size={35} className="text-green-600 mb-3"/>

          <h2 className="text-gray-500 text-lg">
            Vehicles
          </h2>

          <p className="text-3xl font-bold">
            {vehiclesCount}
          </p>

        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6">

          <UserCircle size={35} className="text-purple-600 mb-3"/>

          <h2 className="text-gray-500 text-lg">
            Drivers
          </h2>

          <p className="text-3xl font-bold">
            {driversCount}
          </p>

        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6">

          <Bell size={35} className="text-red-600 mb-3"/>

          <h2 className="text-gray-500 text-lg">
            Alerts
          </h2>

          <p className="text-3xl font-bold">
            {alertsCount}
          </p>

        </motion.div>

      </div>
      {/* Recent Activity */}

<div className="mt-10 bg-white shadow-md rounded-2xl p-6">

<h2 className="text-xl font-semibold text-gray-800 mb-4">
Recent Activity
</h2>

<div className="overflow-x-auto">

<table className="w-full">

<thead>

<tr className="border-b text-gray-500">

<th className="text-left py-3">Activity</th>

<th className="text-left py-3">Description</th>

<th className="text-left py-3">Time</th>

</tr>

</thead>

<tbody>

{activities.length > 0 ? (

activities.slice(0,5).map((activity)=>(

<tr
key={activity.id}
className="border-b hover:bg-gray-50"
>

<td className="py-4 font-medium">

{activity.action}

</td>

<td>

{activity.description}

</td>

<td>

{new Date(activity.created_at).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
})}{" "}
{new Date(activity.created_at).toLocaleTimeString("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}

</td>

</tr>

))

):(

<tr>

<td
colSpan="3"
className="text-center py-6 text-gray-500"
>

No Activity Found

</td>

</tr>

)}

</tbody>

</table>

</div>

</div>

{/* Charts */}

<div className="mt-10">

<ChartSection/>

</div>

<div className="grid lg:grid-cols-2 gap-6 mt-10">

{/* Important Alerts */}

<div className="bg-white shadow-md rounded-2xl p-6">

  <h2 className="text-xl font-semibold mb-6 text-gray-800">
    Important Alerts 🚨
  </h2>

  <div className="space-y-4">

    {alerts.length > 0 ? (

      alerts.map((alert, index) => (

        <div
          key={index}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
        >

          <h3 className="font-semibold text-red-600">
            {alert.title}
          </h3>

          <p className="text-gray-600">
            {alert.message}
          </p>

        </div>

      ))

    ) : (

      <div className="text-center py-6 text-gray-500">
        No Alerts
      </div>

    )}

  </div>

</div>
{/* System Progress */}

<div className="bg-white shadow-md rounded-2xl p-6">

  <h2 className="text-xl font-semibold mb-6 text-gray-800">
    System Progress 📈
  </h2>

  <div className="space-y-6">

    {/* Students */}

    <div>
      <div className="flex justify-between mb-2">
        <span>Students Registered</span>
        <span>{studentsCount}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{
            width: `${Math.min((studentsCount / 10) * 100, 100)}%`,
          }}
        ></div>
      </div>
    </div>

    {/* Vehicles */}

    <div>
      <div className="flex justify-between mb-2">
        <span>Vehicles Available</span>
        <span>{vehiclesCount}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-600 h-3 rounded-full"
          style={{
            width: `${Math.min((vehiclesCount / 10) * 100, 100)}%`,
          }}
        ></div>
      </div>
    </div>

    {/* Routes */}

    <div>
      <div className="flex justify-between mb-2">
        <span>Routes Created</span>
        <span>{routesCount}</span>
      </div>

      <div className="bg-gray-200 rounded-full h-3">
        <div
          className="bg-purple-600 h-3 rounded-full"
          style={{
            width: `${Math.min((routesCount / 10) * 100, 100)}%`,
          }}
        ></div>
      </div>
    </div>
    </div>

  </div>

</div>

</div>

</MainLayout>
  );
}

export default Dashboard;