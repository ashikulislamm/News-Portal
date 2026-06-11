import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

export default function EditProfileForm({ user, loading, onUpdate }) {
  const defaultAvatar = "https://i.pravatar.cc/150?img=1";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    bio: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Sync state with user prop
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      // Local preview only as API currently doesn't support profile image upload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(form);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 select-none">
          Edit Profile
        </h2>
        <p className="text-sm text-slate-500">
          Update your account credentials, bio details, and address records.
        </p>
      </div>

      {/* Change Avatar widgets */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 select-none">
        <div className="relative group rounded-2xl overflow-hidden w-20 h-20 border-2 border-white shadow-md bg-white shrink-0">
          <img
            src={avatarPreview || user.profileImage || defaultAvatar}
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
          <p className="text-xs text-slate-500">
            Choose a high-resolution photo so readers recognize you.
          </p>
          <div className="relative inline-block mt-2">
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              className="sr-only"
            />
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 cursor-pointer shadow-sm hover:bg-slate-50 transition duration-150"
            >
              Choose file
            </label>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
        {/* Full Name */}
        <Input
          label="Full Name"
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          icon={UserIcon}
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          icon={EnvelopeIcon}
          required
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          icon={PhoneIcon}
        />

        {/* Country */}
        <Input
          label="Country"
          id="country"
          name="country"
          value={form.country}
          onChange={handleChange}
          icon={GlobeAltIcon}
        />

        {/* Street Address */}
        <Input
          label="Street Address"
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          icon={MapPinIcon}
          className="md:col-span-2"
        />

        {/* Bio / Description */}
        <Input
          label="Bio / Description"
          id="bio"
          name="bio"
          textarea
          rows={4}
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell readers about yourself..."
          className="md:col-span-2"
        />

        {/* Submit */}
        <div className="md:col-span-2 pt-2">
          <Button
            type="submit"
            loading={loading}
            className="w-full py-3.5 uppercase"
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
