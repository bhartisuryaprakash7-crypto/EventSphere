import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const teamMembers = [
  {
    name: "Surya Prakash Bharti",
    country: "India",
    role: "Frontend Developer | UI/UX",
    skills: ["React", "Tailwind", "JavaScript", "UI/UX"],
    image: "/team/surya.jpeg",
  },
  {
    name: "Gopal Kumar Gond",
    country: "India",
    role: "Backend Developer",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    image: "/team/rahul.jpg",
  },
  {
    name: "Satyam Yadav",
    country: "India",
    role: "AI, Documentation & Business Module",
    skills: ["AI", "Figma", "Documentation"],
    image: "/team/priya.jpg",
  },
  {
    name: "Jaiveer Tanwar",
    country: "India",
    role: "Project Manager",
    skills: ["Agile", "Scrum", "Leadership"],
    image: "/team/aman.jpg",
  },
];

const Login = () => {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("student"); // ✅
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role } // ✅ role bheja
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(user);

      // ✅ user.role se redirect (server verified)
      if (user.role === "admin")          navigate("/admin/dashboard");
      else if (user.role === "organizer") navigate("/organizer/dashboard");
      else if (user.role === "faculty")   navigate("/faculty/dashboard");
      else                                navigate("/student/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2d0055] py-12 px-4">

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="text-5xl">🌐</span>
        <h2 className="mt-4 text-3xl font-extrabold text-white">
          Sign in to EventSphere
        </h2>
        <p className="mt-2 text-sm text-gray-300">
          Or{" "}
          <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
            create a new account
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@college.com"
                className="mt-1 block w-full px-3 py-2 border rounded-xl"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border rounded-xl"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-xl"
              >
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Forgot Password */}
            <div>
              <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mt-24">
        <h2 className="text-4xl font-bold text-center text-white mb-3">
          Meet Our Team
        </h2>
        <p className="text-center text-gray-300 mb-10">
          The talented people behind EventSphere
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative bg-[#02044f] rounded-[30px] border-2 border-black overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-center mt-16">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-36 h-36 rounded-full object-cover border-4 border-pink-200"
                />
              </div>

              <div className="text-center px-6 py-5">
                <h3 className="text-white text-3xl font-bold">{member.name}</h3>
                <p className="text-white text-xl font-semibold mt-2">{member.country}</p>
                <p className="text-white mt-5 min-h-[70px]">{member.role}</p>

                <div className="flex justify-center gap-3 mt-5">
                  <button className="border border-cyan-400 text-cyan-400 px-4 py-2 hover:bg-cyan-400 hover:text-black transition">
                    Message
                  </button>
                  <button className="border border-cyan-400 text-cyan-400 px-4 py-2 hover:bg-cyan-400 hover:text-black transition">
                    Following
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-500"></div>

              <div className="p-4">
                <h4 className="text-white text-2xl font-bold mb-4">SKILLS</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-white border border-gray-400 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Login;