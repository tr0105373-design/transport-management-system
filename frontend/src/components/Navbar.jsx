import { UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

  const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));

const [time, setTime] = useState(new Date());

useEffect(() => {

  const interval = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(interval);

}, []);

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  navigate("/login");

};

  return (
    <div className="bg-white px-8 py-4 shadow-sm flex justify-between items-center">

    <h1 className="text-2xl font-bold text-slate-800">
       Transport System
    </h1>

      <div className="flex items-center gap-6">

  <div className="text-right">

    <p className="text-sm text-gray-500">
     <p className="text-sm text-gray-500">
       {time.toLocaleDateString("en-GB", {
         day: "2-digit",
         month: "short",
         year: "numeric",
       })}
      </p>
    </p>

    <p className="font-semibold text-slate-700">
     <p className="font-semibold text-slate-700">
       {time.toLocaleTimeString([], {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
        })}
      </p>
    </p>

  </div>

  <div className="flex items-center gap-3">

    <UserCircle size={34} className="text-blue-600" />

    <div>

      <p className="font-semibold">
        {user?.name || "Admin"}
      </p>

      <p className="text-xs text-gray-500">
        {user?.email}
      </p>

    </div>

  </div>

  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
  >

    <LogOut size={18} />

    Logout

  </button>

</div>
</div>
  );
}

export default Navbar;