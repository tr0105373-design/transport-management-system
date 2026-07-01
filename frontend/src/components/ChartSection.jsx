import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";

const COLORS = ["#22C55E", "#F59E0B", "#EF4444"];

function ChartSection() {

  const [analytics, setAnalytics] = useState({
    students: 0,
    vehicles: 0,
    drivers: 0,
    routes: 0,
    vehicleStatus: {
      active: 0,
      expiring: 0,
      expired: 0,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {

      const res = await api.get("/analytics");

      setAnalytics(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  const pieData = [
    {
      name: "Active",
      value: analytics.vehicleStatus.active,
    },
    {
      name: "Expiring",
      value: analytics.vehicleStatus.expiring,
    },
    {
      name: "Expired",
      value: analytics.vehicleStatus.expired,
    },
  ];

  const barData = [
    {
      name: "Students",
      value: analytics.students,
    },
    {
      name: "Vehicles",
      value: analytics.vehicles,
    },
    {
      name: "Drivers",
      value: analytics.drivers,
    },
    {
      name: "Routes",
      value: analytics.routes,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-6 mt-10"
    >

      {/* Vehicle Status */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          Vehicle Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={pieData}
              outerRadius={100}
              dataKey="value"
              label
            >

              {pieData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* Analytics */}

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          System Analytics
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </motion.div>
  );
}

export default ChartSection;