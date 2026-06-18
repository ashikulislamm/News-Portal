import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  Cog6ToothIcon,
  FolderIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { authService } from "../api/services/auth";
import { newsService } from "../api/services/news";

import ProfileInfo from "../components/features/profile/ProfileInfo";
import EditProfileForm from "../components/features/profile/EditProfileForm";
import PublishedNewsList from "../components/features/profile/PublishedNewsList";
import NewsForm from "../components/features/news/NewsForm";

import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Toast from "../components/ui/Toast";

export function UserDashboard() {
  const [activeSection, setActiveSection] = useState("userInfo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Modals state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Data states
  const { user, updateUser, logout, currentUserId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Submit loadings
  const [profileLoading, setProfileLoading] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [editPostLoading, setEditPostLoading] = useState(false);
  const [deletePostLoading, setDeletePostLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch Published News by current User
  const fetchUserPosts = async () => {
    if (!currentUserId) return;
    setPostsLoading(true);
    try {
      const res = await newsService.getNews({ authorId: currentUserId });
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentUserId]);

  // Handle Profile Update submit
  const handleProfileUpdate = async (formData) => {
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      updateUser(res.user);
      setToast({
        message: res.message || "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
      setToast({
        message: err.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle News Upload submit
  const handleCreatePost = async (formData) => {
    setCreatePostLoading(true);
    try {
      const res = await newsService.createNews(formData);
      setToast({
        message: res.message || "News article published successfully!",
        type: "success",
      });
      // Refresh user posts list
      await fetchUserPosts();
      setActiveSection("postedNews");
    } catch (err) {
      console.error("Failed to publish news:", err);
      setToast({
        message: err.response?.data?.message || "Failed to post news",
        type: "error",
      });
    } finally {
      setCreatePostLoading(false);
    }
  };

  // Handle Edit Post modal trigger
  const handleEditModalOpen = (postId) => {
    const postToEdit = posts.find((p) => p._id === postId);
    if (postToEdit) {
      setSelectedPost(postToEdit);
      setEditModalOpen(true);
    }
  };

  // Handle Edit Post submit
  const handleUpdatePostSubmit = async (formData) => {
    if (!selectedPost) return;
    setEditPostLoading(true);
    try {
      const res = await newsService.updateNews(selectedPost._id, formData);
      setToast({
        message: res.message || "News article updated successfully!",
        type: "success",
      });
      setEditModalOpen(false);
      setSelectedPost(null);
      await fetchUserPosts();
    } catch (err) {
      console.error("Failed to update news post:", err);
      setToast({
        message: err.response?.data?.message || "Failed to update post",
        type: "error",
      });
    } finally {
      setEditPostLoading(false);
    }
  };

  // Handle Delete News modal trigger
  const handleDeleteModalOpen = (post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  // Handle Delete Post submit
  const handleDeletePostSubmit = async () => {
    if (!selectedPost) return;
    setDeletePostLoading(true);
    try {
      const res = await newsService.deleteNews(selectedPost._id);
      setToast({
        message: res.message || "Article deleted successfully",
        type: "success",
      });
      setDeleteModalOpen(false);
      setSelectedPost(null);
      await fetchUserPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
      setToast({
        message: err.response?.data?.message || "Failed to delete post",
        type: "error",
      });
    } finally {
      setDeletePostLoading(false);
    }
  };

  // Handle Logout Confirmation click
  const handleLogoutConfirm = () => {
    logout();
    setToast({ message: "Logged out successfully!", type: "success" });
    setLogoutModalOpen(false);
    setTimeout(() => {
      navigate("/login");
    }, 500);
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

  return (
    <section className="min-h-screen py-10">
      {/* Toast Alert popup container */}
      <AnimatePresence>
        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Left Navigation Menu Panel (Desktop & Mobile header layouts) */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* Mobile Sidebar Trigger Toggler */}
            <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4 select-none">
              <span className="font-extrabold text-sm text-slate-800">
                Dashboard Management
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-100 transition cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Navigation item lists */}
            <nav
              className={`bg-white p-4.5 rounded-3xl border border-slate-100 shadow-sm space-y-1.5 transition-all duration-300 ${
                isMobileMenuOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="pb-3 border-b border-slate-100 mb-3 text-left hidden lg:block select-none">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Publisher Console
                </span>
              </div>
              <ul className="space-y-1 text-left">
                {menuItems.map((item) => {
                  const isActive = activeSection === item.key;
                  const isLogout = item.key === "logout";

                  return (
                    <li key={item.key}>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (isLogout) {
                            setLogoutModalOpen(true);
                          } else {
                            setActiveSection(item.key);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition duration-150 cursor-pointer ${
                          isActive
                            ? "bg-amber-500/10 text-[var(--color-accent)]"
                            : isLogout
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* 2. Right Workspace Content Panel */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {/* Tab 1: Dashboard Info */}
              {activeSection === "userInfo" && (
                <ProfileInfo
                  user={user}
                  posts={posts}
                  postsCount={posts.length}
                  postsLoading={postsLoading}
                  onNavigateToPosts={() => setActiveSection("postedNews")}
                />
              )}

              {/* Tab 2: Settings Profile edit */}
              {activeSection === "settings" && (
                <EditProfileForm
                  user={user}
                  loading={profileLoading}
                  onUpdate={handleProfileUpdate}
                />
              )}

              {/* Tab 3: Published articles management */}
              {activeSection === "postedNews" && (
                <PublishedNewsList
                  posts={posts}
                  postsLoading={postsLoading}
                  onEditPost={handleEditModalOpen}
                  onDeletePost={handleDeleteModalOpen}
                  onCreateClick={() => setActiveSection("postNews")}
                />
              )}

              {/* Tab 4: News create uploads */}
              {activeSection === "postNews" && (
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 select-none">
                      Publish News Article
                    </h2>
                    <p className="text-sm text-slate-550">
                      Submit and release a verified news article to the global feed.
                    </p>
                  </div>
                  <NewsForm
                    onSubmit={handleCreatePost}
                    loading={createPostLoading}
                    submitLabel="Publish Article Online"
                  />
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Confirm Deletion Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        title="Confirm Article Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete the article{" "}
            <span className="font-bold text-slate-905">"{selectedPost?.title}"</span>? 
            This action cannot be undone and will delete all associated reader discussions.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedPost(null);
              }}
              variant="outline"
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePostSubmit}
              loading={deletePostLoading}
              variant="danger"
              className="px-4 py-2"
            >
              Delete Article
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Article Modal ──────────────────────────────────────────────── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPost(null);
        }}
        title="Edit Published Article"
        size="lg"
      >
        {selectedPost && (
          <NewsForm
            initialValues={selectedPost}
            onSubmit={handleUpdatePostSubmit}
            loading={editPostLoading}
            submitLabel="Save Changes & Update"
          />
        )}
      </Modal>

      {/* ── Confirm Logout Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm System Logout"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to log out of the publisher dashboard? Your draft entries will be lost.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button
              onClick={() => setLogoutModalOpen(false)}
              variant="outline"
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogoutConfirm}
              variant="danger"
              className="px-4 py-2"
            >
              Logout Now
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
