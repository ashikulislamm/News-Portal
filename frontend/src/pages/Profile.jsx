import { useState } from "react";
import { motion } from "framer-motion";
import { UserIcon, Cog6ToothIcon, FolderIcon, ArrowPathIcon, ArrowRightOnRectangleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import UserAvatar from "../assets/Logo.png"; // Update with your avatar image


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

  const avatar = UserAvatar;
  const username = "John Doe";

  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    country: "United States of America",
    profileImage: avatar, // default image
  });

  const [posts, setPosts] = useState([
    { id: 1, title: "News 1", excerpt: "This is an example of a news article." },
    { id: 2, title: "News 2", excerpt: "This is another example of a news article." },
  ]);

  const [newPost, setNewPost] = useState({ title: "", content: "", image: null });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewPost({ ...newPost, image: file });
  };

  const handlePost = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append("title", newPost.title);
    postData.append("content", newPost.content);
    postData.append("image", newPost.image);
    
    // Simulate adding a new post
    setPosts([...posts, { id: posts.length + 1, title: newPost.title, excerpt: newPost.content }]);
    setNewPost({ title: "", content: "", image: null });
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
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <img
            src={user.profileImage}
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-[#a9b5df] shadow-lg object-cover"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-bold text-[#2d336b]">User Information</h2>
            <p className="text-[#ec4d4d] font-medium">{username}</p>
            <p className="text-gray-600 leading-relaxed">
              I build secure and decentralized solutions for protecting intellectual property. My mission is to empower creators through robust blockchain verification and seamless licensing processes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-6 gap-y-4 text-sm text-[#2d336b]">
              <div><span className="font-semibold">Full Name:</span> {user.fullName}</div>
              <div><span className="font-semibold">Email:</span> {user.email}</div>
              <div><span className="font-semibold">Phone:</span> {user.phone}</div>
              <div><span className="font-semibold">Country:</span> {user.country}</div>
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
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">Edit Profile</h2>
        <div className="flex items-center mb-6 gap-6">
          <img
            src={user.profileImage}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#a9b5df]"
          />
          <div>
            <label className="block mb-1 text-sm font-semibold text-[#2d336b]">Change Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-[#2d336b] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-[#7886c7] hover:file:bg-[#2d336b]"
            />
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#2d336b]">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="United States"
              value={user.country}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#7886c7] text-white font-semibold py-3 rounded-lg hover:bg-[#2d336b] transition-all">
              Save Changes
            </button>
          </div>
        </form>
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
            <li key={post.id} className="flex justify-between items-center p-4 border rounded-lg bg-white shadow">
              <div>
                <h3 className="font-semibold text-[#2d336b]">{post.title}</h3>
                <p className="text-[#7886c7]">{post.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(post.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="px-3 py-1 bg-red-500 text-white rounded-md">Delete</button>
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
        <h2 className="text-2xl font-bold mb-4 text-[#2d336b]">Post News</h2>
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter news title"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Enter news content"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-4 py-2 border border-[#a9b5df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7886c7]"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="image">Image</label>
            <input
              id="image"
              type="file"
              onChange={handleFileChange}
              className="w-full mt-2 p-2 border border-[#a9b5df] rounded-lg"
            />
          </div>

          <button type="submit" className="w-full bg-[#7886c7] text-white font-semibold py-3 rounded-lg hover:bg-[#2d336b] transition-all">
            Post News
          </button>
        </form>
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
        <div className="bg-[var(--color-accent)] text-white lg:w-64 p-4 relative rounded-lg lg:rounded-r-none lg:rounded-tl-3xl">
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
            className={`space-y-2 mt-6 ${isMobileMenuOpen ? "block" : "hidden"} lg:block`}
          >
            {menuItems.map((item) => (
              <li
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  activeSection === item.key
                    ? "bg-[var(--color-background)] text-[#2d336b] font-semibold"
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
