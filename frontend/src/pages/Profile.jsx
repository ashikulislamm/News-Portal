import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import UserAvatar from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const menuItems = [
  {
    name: "User Information",
    icon: <UserIcon className="h-5 w-5" />,
    key: "userInfo",
  },
  {
    name: "Settings",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    key: "settings",
  },
  {
    name: "Posted News",
    icon: <FolderIcon className="h-5 w-5" />,
    key: "postedNews",
  },
  {
    name: "Post News",
    icon: <ArrowPathIcon className="h-5 w-5" />,
    key: "postNews",
  },
  {
    name: "Logout",
    icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
    key: "logout",
  },
];

export const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("userInfo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  // Alert cleanup
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [alert.message]); // Effect runs only when alert.message changes

  const handleLogout = () => {
    // Remove token or any user data from localStorage
    localStorage.removeItem("token");
    // Optionally clear other user info
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  const avatar = UserAvatar;
  const username = "John Doe";

  //For Users
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    profileImage: avatar, // default image
  });

  // Fetch user info after component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Fetched user:", response.data);

        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          country: response.data.country,
        });
      } catch (err) {
        // Only logout if token is invalid or expired
        if (err.response?.status === 401) {
          console.warn("Token invalid or expired, logging out");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          // For other errors, just log
          console.error(
            "Failed to fetch user info:",
            err.response?.data || err
          );
        }
      }
    };

    fetchUser();
  }, []);
  // Update User Info
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          country: user.country,
          address: user.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Profile updated:", response.data);

      // Update local state with the returned user
      setUser(response.data.user);

      // Optional: show success alert
      setAlert({ message: response.data.message, type: "success" });
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err);
      setAlert({
        message: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "News 1",
      excerpt: "This is an example of a news article.",
    },
    {
      id: 2,
      title: "News 2",
      excerpt: "This is another example of a news article.",
    },
  ]);

  //For Post News
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  //Post News Function
  const handlePost = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (file) formData.append("image", file);

      const response = await axios.post(
        "http://localhost:5000/api/news",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAlert({ message: response.data.message, type: "success" });
      setNewPost({ title: "", content: "" });
      setFile(null);
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to post news",
        type: "error",
      });
    }
  };

  const handleEdit = (postId) => {
    console.log("Editing post:", postId);
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const sections = {
    userInfo: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 text-left">
          <img
            src={user.profileImage || avatar} // fallback to default avatar
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-[#a9b5df] shadow-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <p className="text-[#ec4d4d] text-3xl font-medium">
              {user.fullName || "User"} {/* display actual full name */}
            </p>
            <p className="text-gray-600 leading-relaxed">
              I build secure and decentralized solutions for protecting
              intellectual property. My mission is to empower creators through
              robust blockchain verification and seamless licensing processes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 gap-y-4 text-sm text-[#2d336b]">
              <div>
                <span className="font-semibold">Full Name:</span>{" "}
                {user.fullName || "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {user.email || "-"}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {user.phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                {user.address || "-"}
              </div>
              <div>
                <span className="font-semibold">Country:</span>{" "}
                {user.country || "-"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    settings: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
          Edit Profile
        </h2>
        <div className="flex items-center mb-6 gap-6">
          <img
            src={user.profileImage || avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#a9b5df]"
          />
          <div>
            <label className="block mb-1 text-sm text-left font-semibold text-[var(--color-text)]">
              Change Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-[var(--color-accent)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[var(--color-accent)]"
            />
          </div>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--color-text)]"
          onSubmit={handleUpdate}
        >
          <div>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1"
              htmlFor="country"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              placeholder="United States"
              value={user.country}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="bio">
              Address
            </label>
            <input
              id="bio"
              rows={4}
              placeholder="Tell us something about yourself..."
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            ></input>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1" htmlFor="bio">
              Bio / Description
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us something about yourself..."
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[var(--color-accent)] text-white font-semibold py-3 rounded-lg cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
        {alert.message && (
          <div
            className={`fixed right-5 top-25 p-4 rounded-lg text-white shadow-md ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}
      </motion.div>
    ),
    postedNews: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">Posted News</h2>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex justify-between items-center p-4 border rounded-lg bg-white shadow"
            >
              <div>
                <h3 className="font-semibold text-[#2d336b]">{post.title}</h3>
                <p className="text-[#7886c7]">{post.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    ),
    postNews: (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
          Post News
        </h2>
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label
              className="block text-sm font-semibold mb-1 text-left"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter news title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1 text-left"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              placeholder="Enter news content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            ></textarea>
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1 text-left"
              htmlFor="image"
            >
              Image
            </label>
            <input
              id="image"
              type="file"
              onChange={handleFileChange}
              className="w-full mt-2 p-2 border border-[var(--color-accent)] rounded-lg  file:text-white file:py-1 file:px-4 file:rounded-lg file:bg-[var(--color-accent)]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white font-semibold py-3 rounded-lg cursor-pointer"
          >
            Post News
          </button>
        </form>
        {alert.message && (
          <div
            className={`fixed right-5 top-25 p-4 rounded-lg text-white shadow-md ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}
      </motion.div>
    ),
    logout: (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#2d336b]">
          You have been logged out.
        </h2>
        <p className="text-center text-[#7886c7]">
          Redirecting to login page...
        </p>
      </motion.div>
    ),
  };

  return (
    <>
      <div className="mt-16"></div>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f9faff]">
        {/* Sidebar */}
        <div className="bg-[var(--color-background)] text-[var(--color-text)] lg:w-64 p-4 relative rounded-lg lg:rounded-r-none lg:rounded-tl-3xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <p className="text-sm font-medium">{username}</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white focus:outline-none hover:bg-[#7886c7] p-2 rounded-lg"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <ul
            className={`space-y-2 mt-6 ${
              isMobileMenuOpen ? "block" : "hidden"
            } lg:block`}
          >
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  if (item.key === "logout") {
                    handleLogout(); // call logout function
                  } else {
                    setActiveSection(item.key);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  activeSection === item.key
                    ? "bg-[var(--color-accent)] text-white font-semibold"
                    : "hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                }`}
              >
                {item.icon}
                <span className="sm:inline">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-tl-3xl">
          {sections[activeSection]}
        </main>
      </div>
    </>
  );
};
