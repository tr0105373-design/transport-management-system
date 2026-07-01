import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, Bus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Login() {

  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    navigate("/");
  }
}, [navigate]);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await api.post("/auth/login", formData);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("role", res.data.user.role);

    alert("Login Successful");

    navigate("/");

  } catch (error) {

    alert(
      error.response?.data?.message || "Login Failed"
    );

  } finally {

    setLoading(false);

  }
};
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">

    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

      <div className="flex flex-col items-center mb-8">

        <div className="bg-blue-100 p-4 rounded-full">
          <Bus className="text-blue-600" size={40} />
        </div>

        <h1 className="text-3xl font-bold mt-4 text-gray-800">
          Transport Management System
        </h1>

        <p className="text-gray-500 mt-2">
          Admin Login Portal
        </p>

      </div>

      <form onSubmit={handleLogin} className="space-y-5">

        {/* Email */}

        <div>

          <label className="text-gray-700 font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center border rounded-xl px-4 py-3">

            <Mail className="text-gray-400 mr-3" size={20} />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="text-gray-700 font-medium">
            Password
          </label>

          <div className="mt-2 flex items-center border rounded-xl px-4 py-3">

            <Lock className="text-gray-400 mr-3" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >

              {showPassword ? (
                <EyeOff size={20} className="text-gray-500" />
              ) : (
                <Eye size={20} className="text-gray-500" />
              )}

            </button>

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white py-3 rounded-xl font-semibold transition">
          {loading ? "Signing In..." : "Login"}
        </button>

      </form>

      <p className="text-center text-gray-400 text-sm mt-6">
        © 2026 Transport Management System
      </p>
      </div>

  </div>
);
}

export default Login;