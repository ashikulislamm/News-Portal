import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
        </svg>
      )}
    </button>
  );
};

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

  const avatar = "https://i.pravatar.cc/150?img=1";
  const [avatarPreview, setAvatarPreview] = useState(null);

  // For Users
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    bio: "",
    profileImage: avatar,
  });

  // Alert cleanup
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAlert({ message: "Logged out successfully!", type: "success" });
    setTimeout(() => {
      navigate("/login");
    }, 800);
  };

  // Fetch user info after component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
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

        setUser({
          fullName: response.data.fullName,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          country: response.data.country,
          bio: response.data.bio || "",
          _id: response.data._id,
          profileImage: avatar,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          console.error("Failed to fetch user info:", err.response?.data || err);
        }
      }
    };

    fetchUser();
  }, [navigate]);

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

      setUser(response.data.user);
      setAlert({ message: response.data.message || "Profile updated successfully!", type: "success" });
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

  // ---- CRUD Operations for Posts ----
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

      setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id));
      setAlert({ message: response.data.message || "Article deleted successfully", type: "success" });
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

  // For Post News
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
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

      setAlert({ message: response.data.message || "News article published successfully!", type: "success" });
      setNewPost({ title: "", content: "" });
      setFile(null);

      // Refresh the posts list
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/news/user/${currentUserId}`
      );
      setPosts(res.data);
      setActiveSection("postedNews");
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to post news",
        type: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };

  // ----------- Edit Post -------------------
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
      setIsModalOpen(true);
    }
  };

  const handleEditPost = async () => {
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
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
      setPosts(res.data);

      setIsModalOpen(false);
      setAlert({ message: "Article updated successfully!", type: "success" });
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Failed to update post",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const menuItems = [
    {
      name: "Dashboard Info",
      icon: <UserIcon className="h-5 w-5" />,
      key: "userInfo",
    },
    {
      name: "Edit Profile",
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      key: "settings",
    },
    {
      name: "Published News",
      icon: <FolderIcon className="h-5 w-5" />,
      key: "postedNews",
    },
    {
      name: "Publish News",
      icon: <ArrowPathIcon className="h-5 w-5" />,
      key: "postNews",
    },
    {
      name: "Logout",
      icon: <ArrowRightOnRectangleIcon className="h-5 w-5 text-rose-500" />,
      key: "logout",
    },
  ];

  const sections = {
    userInfo: (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 text-left"
      >
        {/* Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-zinc-900 to-amber-950 rounded-3xl h-44 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-[var(--color-accent)] opacity-15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[20%] w-72 h-72 bg-amber-500 opacity-10 rounded-full blur-3xl" />
        </div>

        {/* Breakout Info Header (Using flow layout & negative margin) */}
        <div className="px-8 flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-6">
          <img
            src={user.profileImage || avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-xl bg-slate-50 z-10 shrink-0"
          />
          <div className="text-center sm:text-left pb-1">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <h2 className="text-2xl font-black text-slate-900">
                {user.fullName || "Journalist Name"}
              </h2>
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-[var(--color-accent)] ring-1 ring-inset ring-amber-500/20">
                Contributor
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Verified News Publisher
            </p>
          </div>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Biography & Recent Activity (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Biography Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden text-left">
              {/* Decorative background quotation mark */}
              <span className="absolute top-2 right-6 text-8xl font-serif text-slate-100/85 font-black select-none pointer-events-none">
                “
              </span>
              <div className="relative z-10 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biography</h3>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {user.bio || "No biography provided yet. Head over to Edit Profile to share details about your background, publications, and interests."}
                </p>
              </div>
            </div>

            {/* Recent Publications Feed Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Recent Publications</h3>
                <button
                  onClick={() => setActiveSection("postedNews")}
                  className="text-xs font-bold text-[var(--color-accent)] hover:text-amber-700 transition cursor-pointer"
                >
                  View All
                </button>
              </div>

              {postsLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-bold">No articles published yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.slice(0, 3).map((post) => (
                    <div
                      key={post._id}
                      onClick={() => setActiveSection("postedNews")}
                      className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100/80 cursor-pointer transition duration-150 group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                          {post.imageUrl ? (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-amber-500/10 flex items-center justify-center text-[var(--color-accent)]">
                              <FolderIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-[var(--color-accent)] transition">
                            {post.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-md shrink-0">
                        Live
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Credentials & Stats (1/3 width) */}
          <div className="space-y-6">
            {/* Publisher Metadata Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Directory Metadata</h3>
              
              <div className="space-y-4 text-slate-755">
                {/* Email Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                    <EnvelopeIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-grow">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                    <p className="text-xs font-bold text-slate-800 break-all mt-0.5">{user.email || "-"}</p>
                  </div>
                  {user.email && (
                    <CopyButton text={user.email} />
                  )}
                </div>

                {/* Phone Number Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                    <PhoneIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-grow">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</p>
                    <p className="text-xs font-bold text-slate-800 break-all mt-0.5">{user.phone || "-"}</p>
                  </div>
                  {user.phone && (
                    <CopyButton text={user.phone} />
                  )}
                </div>

                {/* Country Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                    <GlobeAltIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-grow">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Country Location</p>
                    <p className="text-xs font-bold text-slate-800 break-words mt-0.5">{user.country || "-"}</p>
                  </div>
                </div>

                {/* Street Address Item */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/10 text-[var(--color-accent)] rounded-lg shrink-0">
                    <MapPinIcon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 text-left flex-grow">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Street Address</p>
                    <p className="text-xs font-bold text-slate-800 break-words mt-0.5">{user.address || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats board */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stat 1 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left">
                <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Total Articles</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{posts.length}</div>
              </div>
              {/* Stat 2 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-left flex flex-col justify-between">
                <div className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Console Status</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ),
    settings: (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 text-left"
      >
        <div>
          <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
          <p className="text-sm text-slate-500">Update your account credentials, bio details, and address records.</p>
        </div>

        {/* Change Avatar widget */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          <div className="relative group rounded-2xl overflow-hidden w-20 h-20 border-2 border-white shadow-md bg-white shrink-0">
            <img
              src={avatarPreview || user.profileImage || avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
              <CloudArrowUpIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-grow space-y-1 text-center sm:text-left">
            <label className="block text-sm font-bold text-slate-800">
              Profile Photo
            </label>
            <p className="text-xs text-slate-500">Choose a high-resolution photo so readers recognize you.</p>
            <div className="relative inline-block mt-2">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
              />
              <label
                htmlFor="avatar"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer shadow-sm hover:bg-slate-50 transition duration-150"
              >
                Choose file
              </label>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800" onSubmit={handleUpdate}>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <UserIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="fullName"
                type="text"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="email">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <PhoneIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="phone"
                type="tel"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="country">
              Country
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <GlobeAltIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="country"
                type="text"
                value={user.country}
                onChange={(e) => setUser({ ...user, country: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="address">
              Street Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <MapPinIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <input
                id="address"
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="bio">
              Bio / Description
            </label>
            <textarea
              id="bio"
              rows={4}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200 resize-none"
              placeholder="Tell readers about yourself..."
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    ),
    postedNews: (
      <div className="text-left space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                Published Articles
              </h2>
              <p className="text-sm text-slate-500">Edit, remove, or monitor your existing publisher feeds.</p>
            </div>
            <div className="text-xs font-bold text-[var(--color-accent)] bg-amber-500/10 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              {posts.length} {posts.length === 1 ? "Article" : "Articles"} Published
            </div>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse space-y-4"
                >
                  <div className="w-full h-44 bg-slate-200 rounded-xl"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-9 bg-slate-200 rounded-lg flex-1"></div>
                    <div className="h-9 bg-slate-200 rounded-lg flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <FolderIcon className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No articles published yet</h3>
              <p className="text-sm text-slate-500 mb-6">Start sharing verified news stories with the world.</p>
              <button
                onClick={() => setActiveSection("postNews")}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] text-white text-xs font-bold px-4 py-2.5 hover:opacity-90 active:scale-[0.98] shadow-md shadow-amber-600/10 transition cursor-pointer"
              >
                Create First Article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-500/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Image block */}
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-200 relative">
                      {post.imageUrl ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${post.imageUrl}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-500/10 to-amber-500/20 flex items-center justify-center">
                          <svg className="w-10 h-10 text-[var(--color-accent)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-[var(--color-accent)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {post.content || post.excerpt || "No summary text available."}
                      </p>
                    </div>
                  </div>

                  {/* Metadata & Actions row */}
                  <div className="space-y-4 mt-5 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {new Date(post.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        onClick={() => openEditModal(post._id)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-amber-500/10 text-slate-700 hover:text-[var(--color-accent)] border border-slate-200 hover:border-amber-500/20 py-2 text-xs font-bold transition duration-200 cursor-pointer shadow-sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(post)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 py-2 text-xs font-bold transition duration-200 cursor-pointer shadow-sm"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Edit Article Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col justify-between border border-slate-100"
              >
                {/* Modal Header */}
                <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <PencilIcon className="h-5 w-5 text-[var(--color-accent)]" />
                    <span>Edit Published Article</span>
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Article Title
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      value={editPost.title}
                      onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
                      placeholder="Title of news post..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-content" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Article Content
                    </label>
                    <textarea
                      id="edit-content"
                      value={editPost.content}
                      onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200 resize-none"
                      rows="10"
                      placeholder="Full editorial report text..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="order-2 sm:order-1 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleEditPost}
                    disabled={editLoading}
                    className="order-1 sm:order-2 px-5 py-2.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {editLoading ? (
                      <>
                        <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4.5 w-4.5" />
                        <span>Save Article Details</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 text-center"
              >
                {/* Body */}
                <div className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
                    <TrashIcon className="h-8 w-8 text-rose-600" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-950 mb-2">
                    Are you sure?
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed px-2">
                    You're about to delete <span className="font-bold text-slate-800">"{postToDelete?.title}"</span>. This action cannot be undone.
                  </p>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="order-2 sm:order-1 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    Keep Article
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="order-1 sm:order-2 px-5 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deleteLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Yes, Delete Article</span>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    ),
    postNews: (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6 text-left"
      >
        <div>
          <h2 className="text-2xl font-black text-slate-900">Publish News</h2>
          <p className="text-sm text-slate-500">Draft a new story report, attach media, and broadcast instantly to the feed directory.</p>
        </div>

        <form onSubmit={handlePost} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="title">
              Article Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter news headline..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide" htmlFor="content">
              Content Body
            </label>
            <textarea
              id="content"
              placeholder="Start drafting your article details..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[var(--color-accent)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition duration-200 resize-none"
              rows={8}
              required
            />
          </div>

          {/* CMS Drag and Drop zone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Article Thumbnail Image
            </label>
            <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-500/50 bg-slate-50/50 hover:bg-white px-6 py-8 transition duration-200">
              <div className="text-center space-y-2.5">
                {file ? (
                  <div className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircleIcon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-[var(--color-accent)]">
                      <CloudArrowUpIcon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex text-sm text-slate-500 font-medium justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-bold text-[var(--color-accent)] hover:text-amber-700 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-400 font-bold">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={postLoading}
            className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/15 hover:shadow-amber-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {postLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Publishing article...</span>
              </>
            ) : (
              <span>Publish Article Now</span>
            )}
          </button>
        </form>
      </motion.div>
    ),
    logout: (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-16"
      >
        <h2 className="text-2xl font-black mb-2 text-slate-900">
          Logging out...
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          You are being logged out of your active contributor workspace session.
        </p>
      </motion.div>
    ),
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {alert.message && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border text-left ${
                alert.type === "success"
                  ? "bg-emerald-50 border-emerald-100 shadow-emerald-500/5"
                  : "bg-rose-50 border-rose-100 shadow-rose-500/5"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {alert.type === "success" ? (
                  <CheckCircleIcon className="h-5.5 w-5.5 text-emerald-600" />
                ) : (
                  <ExclamationCircleIcon className="h-5.5 w-5.5 text-rose-600" />
                )}
              </div>
              <div className="flex-grow space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {alert.type === "success" ? "Success" : "Error Occurred"}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAlert({ message: "", type: "" })}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] mt-4 rounded-2xl overflow-hidden border border-slate-100">
        {/* Sidebar */}
        <aside className="bg-white text-slate-800 lg:w-64 p-6 relative shrink-0 border-r border-slate-100 flex flex-col justify-between">
          <div>
            {/* Contributor badge & avatar header */}
            <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-slate-100 text-left">
              <div className="relative">
                <img
                  src={user.profileImage || avatar}
                  alt="Avatar"
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-slate-50 shadow-sm bg-slate-50"
                />
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-900 truncate">{user.fullName || "Journalist Name"}</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-[var(--color-accent)] font-bold text-[10px] tracking-wider uppercase mt-0.5">
                  Contributor
                </span>
              </div>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 p-2 rounded-xl border border-slate-150 transition cursor-pointer"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items */}
            <ul className={`space-y-1.5 ${isMobileMenuOpen ? "block" : "hidden"} lg:block text-left`}>
              {menuItems.map((item) => {
                const isItemActive = activeSection === item.key;
                return (
                  <li
                    key={item.key}
                    onClick={() => {
                      if (item.key === "logout") {
                        setLogoutModalOpen(true);
                      } else {
                        setActiveSection(item.key);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition duration-150 select-none
                      ${
                        item.key === "logout"
                          ? "hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                          : isItemActive
                          ? "bg-amber-500/10 text-[var(--color-accent)] shadow-sm shadow-amber-500/5"
                          : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                      }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden lg:block pt-6 border-t border-slate-50 text-[10px] text-slate-400 font-bold tracking-widest uppercase text-left">
            Workspace Console
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow p-8 lg:p-12 overflow-y-auto bg-slate-50/50">
          {sections[activeSection]}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {logoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 text-center"
            >
              {/* Body */}
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                  <ArrowRightOnRectangleIcon className="h-8 w-8 text-[var(--color-accent)]" />
                </div>
                <h4 className="text-lg font-extrabold text-slate-950 mb-2">
                  Confirm Logout
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed px-2">
                  Are you ready to exit your active workspace? You will need to log back in to manage your news feed posts.
                </p>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row gap-2.5 sm:justify-end">
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  className="order-2 sm:order-1 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Stay in Console
                </button>
                <button
                  onClick={() => {
                    setLogoutModalOpen(false);
                    handleLogout();
                  }}
                  className="order-1 sm:order-2 px-5 py-2.5 bg-[var(--color-accent)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Yes, Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
