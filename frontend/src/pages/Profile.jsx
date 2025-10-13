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
//import UserAvatar from "../assets/logo.png";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
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

    // Show success message briefly before redirect
    setAlert({ message: "Logged out successfully!", type: "success" });

    // Redirect to login page after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const avatar = "https://i.pravatar.cc/50?img=1";
  const username = "John Doe";
  //For Users
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    bio: "",
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
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
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
          bio: response.data.bio || "",
          _id: response.data._id,
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
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/profile`,
        {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          country: user.country,
          address: user.address,
          bio: user.bio,
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
  //---- CRUD Operations for Posts ----
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const currentUserId = user._id;
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!currentUserId) return;

      setPostsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/news/user/${currentUserId}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };
    fetchUserPosts();
  }, [currentUserId]);

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/news/${postToDelete._id}`
      );

      // Remove the post from local state after deleting
      setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id));
      setAlert({ message: response.data.message, type: "success" });
      setDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setAlert({
        message: err.response?.data?.message || "Failed to delete post",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  //For Post News
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });
  const [file, setFile] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };
  const handlePost = async (e) => {
    e.preventDefault();

    setPostLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      if (file) formData.append("image", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/news`,
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

      // Refresh the posts list if user is currently viewing posted news
      if (activeSection === "postedNews") {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/news/user/${currentUserId}`
        );
        setPosts(res.data);
      }
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to post news",
        type: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };
  //-----------Edit Post-------------------
  const [editPost, setEditPost] = useState({
    title: "",
    content: "",
    _id: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  const openEditModal = (id) => {
    const postToEdit = posts.find((post) => post._id === id);
    if (postToEdit) {
      setEditPost({
        ...postToEdit,
      });
    }
    setIsModalOpen(true); // Open modal
  };
  const handleEditPost = async () => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/news/${editPost._id}`,
        {
          title: editPost.title,
          content: editPost.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/news/user/${currentUserId}`
      );
      setPosts(res.data); // Re-set posts from the server

      setIsModalOpen(false); // Close the modal
      setAlert({ message: "Post updated successfully", type: "success" });
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to update post",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
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
              {user.bio ||
                "I build secure and decentralized solutions for protecting intellectual property. My mission is to empower creators through robust blockchain verification and seamless licensing processes."}
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
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--color-accent)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
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
      <>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#2d336b] flex items-center gap-2">
              <FolderIcon className="h-5 w-5 md:h-6 md:w-6 text-[var(--color-accent)] flex-shrink-0" />
              <span className="break-words">My Published Articles</span>
            </h2>
            <div className="text-xs md:text-sm text-[#7886c7] bg-[var(--color-background)] px-3 py-1 rounded-full self-start sm:self-auto whitespace-nowrap">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"}
            </div>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-[var(--color-background)] to-white p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 animate-pulse"
                >
                  <div className="flex flex-col space-y-4">
                    {/* Image Skeleton */}
                    <div className="w-full h-48 md:h-40 lg:h-48 bg-gray-200 rounded-lg"></div>

                    {/* Content Skeleton */}
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>

                      {/* Meta Skeleton */}
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                          <div className="h-8 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FolderIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#2d336b] mb-2">
                No articles yet
              </h3>
              <p className="text-[#7886c7] mb-4">
                Start sharing your thoughts with the world!
              </p>
              <button
                onClick={() => setActiveSection("postNews")}
                className="bg-[var(--color-accent)] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Create Your First Article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group bg-gradient-to-r from-[var(--color-background)] to-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[var(--color-accent)]/30"
                >
                  <div className="flex flex-col space-y-4">
                    {/* Article Image */}
                    <div className="w-full h-48 md:h-40 lg:h-48">
                      {post.imageUrl ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${
                            post.imageUrl
                          }`}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-[var(--color-accent)]/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-[#2d336b] line-clamp-2 group-hover:text-[var(--color-accent)] transition-colors mb-3">
                        {post.title}
                      </h3>

                      <p className="text-[#7886c7] line-clamp-3 mb-4 leading-relaxed text-sm md:text-base">
                        {post.content ||
                          post.excerpt ||
                          "No content available."}
                      </p>

                      {/* Article Meta */}
                      <div className="flex flex-col gap-3">
                        {/* Date and Time Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-[#7886c7] lg:justify-start">
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {new Date(post.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => openEditModal(post._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 md:px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 shadow-sm text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(post)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 md:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-sm text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Article
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="edit-title"
                      className="block text-sm font-semibold mb-2 text-[var(--color-text)]"
                    >
                      Article Title
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editPost.title}
                      onChange={(e) =>
                        setEditPost({ ...editPost, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                      placeholder="Enter article title..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-content"
                      className="block text-sm font-semibold mb-2 text-[var(--color-text)]"
                    >
                      Article Content
                    </label>
                    <textarea
                      id="edit-content"
                      value={editPost.content}
                      onChange={(e) =>
                        setEditPost({ ...editPost, content: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                      rows="8"
                      placeholder="Enter article content..."
                    />
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 px-6 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditPost}
                  disabled={editLoading}
                  className="order-1 sm:order-2 px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-xl hover:bg-opacity-90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Delete Article
                  </h3>
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Are you sure?
                  </h4>
                  <p className="text-gray-600 mb-4">
                    You're about to delete "
                    <span className="font-medium text-gray-900">
                      {postToDelete?.title}
                    </span>
                    ". This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="order-2 sm:order-1 px-6 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="order-1 sm:order-2 px-6 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Article
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
        {alert.message && (
          <div
            className={`fixed right-5 top-25 p-4 rounded-lg text-white shadow-md ${
              alert.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alert.message}
          </div>
        )}
      </>
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
            disabled={postLoading}
            className="w-full bg-[var(--color-accent)] text-white font-semibold py-3 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {postLoading ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post News"
            )}
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
              <p className="text-sm font-medium">{user.fullName}</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[var(--color-accent)] focus:outline-none hover:bg-[#7886c7] p-2 rounded-lg"
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
                    setLogoutModalOpen(true); // Show logout confirmation modal
                  } else {
                    setActiveSection(item.key);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  item.key === "logout"
                    ? "hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200"
                    : activeSection === item.key
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

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  Confirm Logout
                </h3>
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <ArrowRightOnRectangleIcon className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to leave?
                </h4>
                <p className="text-gray-600 mb-4">
                  You will be logged out of your account and redirected to the
                  login page. Any unsaved changes will be lost.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="order-2 sm:order-1 px-6 py-2.5 text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setLogoutModalOpen(false);
                  handleLogout();
                }}
                className="order-1 sm:order-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Yes, Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
