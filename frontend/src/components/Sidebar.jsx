import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bus,
  UserCircle,
  Route,
  Bell,
  Activity,
  Wrench,
  CreditCard
} from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">

      {/* Logo */}
      <div className="mb-8 pt-2">
        <h1 className="text-xl font-bold text-center tracking-wide">
          Transport System
        </h1>
      </div>

      <div className="space-y-2 mt-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Users size={20} />
          Students
        </NavLink>

        <NavLink
          to="/vehicles"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Bus size={20} />
          Vehicles
        </NavLink>

        <NavLink
          to="/drivers"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <UserCircle size={20} />
          Drivers
        </NavLink>

        <NavLink
          to="/routes"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Route size={20} />
          Routes
        </NavLink>

        <NavLink
          to="/maintenance"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Wrench size={20} />
          Maintenance
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Bell size={20} />
          Alerts
        </NavLink>

        <NavLink
          to="/fees"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                 ? "bg-blue-600 text-white shadow-lg"
                 : "text-gray-300 hover:bg-slate-800 hover:text-white"
             }`
          }
        >
          <CreditCard size={20} />
          Fees
        </NavLink>

        <NavLink
          to="/activity"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <Activity size={20} />
          Activity
        </NavLink>

      </div>
    </div>
  );
}

export default Sidebar;