// components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Settings, Camera, Edit2, Save, X, LogOut, Mail, User 
} from 'lucide-react';

const SettingsComponent = ({
  teacherName = "Teacher",
  setTeacherName,
  teacherRole = "Class Teacher",
  setTeacherRole,
  isEditingName,
  setIsEditingName,
  handleNameSave,
  classInfo,
  profileImage,
  profileInputRef,
  handleProfileImageUpload
}) => {

  // Local controlled states
  const [safeName, setSafeName] = useState(teacherName);
  const [email, setEmail] = useState("teacher@school.edu");
  const [role, setRole] = useState(teacherRole);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);

  // Sync props if they update later
  useEffect(() => {
    setSafeName(teacherName || "Teacher");
  }, [teacherName]);

  useEffect(() => {
    setRole(teacherRole || "Class Teacher");
  }, [teacherRole]);

  const handleSaveAll = async () => {
    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      setTeacherName(safeName);
      setTeacherRole(role);

      setIsEditingName(false);
      setIsEditingEmail(false);
      setIsEditingRole(false);

      alert("Settings saved successfully!");
    } catch (err) {
      alert("Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSafeName(teacherName);
    setEmail("teacher@school.edu");
    setRole(teacherRole);

    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingRole(false);
  };

  const initials = safeName?.split(" ").map(x => x[0]).join("").toUpperCase() || "?";

  const hasChanges =
    isEditingName || isEditingRole || isEditingEmail;

  return (
    <div className="min-h-screen bg-black p-4 space-y-6"
      style={{ background: "linear-gradient(to bottom, #000000, #0a0f0a)" }}>

      {/* Header Section */}
      <div className="bg-gray-900 rounded-xl p-5 border border-green-500/30 shadow-lg">

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/20 border border-green-400/30">
            <Settings className="text-green-400" />
          </div>

          <div>
            <h2 className="text-white font-bold text-xl">Account Settings</h2>
            <p className="text-green-400 text-sm font-semibold">
              Manage profile and preferences
            </p>
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-5">
          <div
            onClick={() => profileInputRef?.current?.click()}
            className="relative w-28 h-28 rounded-full border-4 border-green-400/30 overflow-hidden cursor-pointer group"
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="bg-gray-800 w-full h-full flex justify-center items-center text-green-400 text-3xl font-extrabold">
                {initials}
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 flex justify-center items-center opacity-0 group-hover:opacity-100 transition">
              <Camera className="text-green-400" />
            </div>
          </div>

          <button
            onClick={() => profileInputRef?.current?.click()}
            className="mt-3 px-5 py-2 text-black bg-green-500 hover:bg-green-400 rounded-lg font-bold transition"
          >
            Upload Photo
          </button>

          <input
            ref={profileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleProfileImageUpload}
          />
        </div>

        {/* Editable Fields */}
        <div className="space-y-5">

          {/* Name */}
          <Field
            label="Full Name"
            value={safeName}
            editable={isEditingName}
            setValue={setSafeName}
            toggleEdit={() => setIsEditingName(!isEditingName)}
          />

          {/* Email */}
          <Field
            label="Email"
            icon={<Mail className="text-green-400" />}
            value={email}
            editable={isEditingEmail}
            setValue={setEmail}
            toggleEdit={() => setIsEditingEmail(!isEditingEmail)}
          />

          {/* Role */}
          <Field
            label="Role"
            icon={<User className="text-green-400" />}
            value={role}
            editable={isEditingRole}
            setValue={setRole}
            toggleEdit={() => setIsEditingRole(!isEditingRole)}
          />
        </div>

        {/* Save / Cancel Buttons */}
        {hasChanges && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex-1 bg-green-500 hover:bg-green-400 text-black px-5 py-3 rounded-xl font-bold flex justify-center items-center gap-2"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleCancel}
              className="px-5 py-3 bg-gray-700 rounded-xl text-white"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Logout Section */}
      <div className="bg-red-500/10 border border-red-500/40 p-5 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogOut className="text-red-400" />
          <p className="text-white font-bold">Log Out</p>
        </div>

        <button className="bg-red-500 hover:bg-red-400 px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

// Reusable Field Component
const Field = ({ label, value, editable, setValue, toggleEdit, icon }) => (
  <div>
    <label className="text-sm text-green-400 font-bold block mb-1">{label}</label>

    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-green-500/20 flex-1">
        {icon && icon}
        <input
          className="bg-transparent text-white flex-1 focus:outline-none"
          value={value}
          readOnly={!editable}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <button 
        onClick={toggleEdit} 
        className={`p-2 border rounded-lg ${editable ? "bg-red-500/30" : "bg-green-500/20"}`}
      >
        {editable ? <X className="text-red-400" /> : <Edit2 className="text-green-400" />}
      </button>
    </div>
  </div>
);

export default SettingsComponent;
