// components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Settings, Camera, Edit2, Save, X, LogOut, Mail, User 
} from 'lucide-react';

const SettingsComponent = ({
  teacherName = "Faculty Officer",
  setTeacherName,
  teacherRole = "Officer",
  setTeacherRole,
  isEditingName,
  setIsEditingName,
  classInfo,
  profileImage,
  profileInputRef,
  handleProfileImageUpload
}) => {

  const navigate = useNavigate();

  const [safeName, setSafeName] = useState(teacherName);
  const [email, setEmail] = useState("officer@school.edu");
  const [role, setRole] = useState(teacherRole);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSafeName(teacherName || "Faculty Officer");
  }, [teacherName]);

  useEffect(() => {
    setRole(teacherRole || "Officer");
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
    } catch {
      alert("Something went wrong while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSafeName(teacherName);
    setEmail("officer@school.edu");
    setRole(teacherRole);
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingRole(false);
  };

  // 🔴 REAL LOGOUT LOGIC (this is what you were missing)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("teacher");
    localStorage.removeItem("auth"); // if unified auth exists

    navigate("/UserLogin", { replace: true });
  };

  const initials =
    safeName?.split(" ").map(x => x[0]).join("").toUpperCase() || "?";

  const hasChanges =
    isEditingName || isEditingRole || isEditingEmail;

  return (
    <div className="min-h-screen bg-black p-4 space-y-6">

      {/* Account Settings */}
      <div className="bg-gray-900 rounded-xl p-5 border border-green-500/30">

        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-green-400" />
          <div>
            <h2 className="text-white font-bold text-xl">Account Settings</h2>
            <p className="text-green-400 text-sm">Manage profile</p>
          </div>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center mb-6">
          <div
            onClick={() => profileInputRef?.current?.click()}
            className="relative w-28 h-28 rounded-full border-4 border-green-400/30 overflow-hidden cursor-pointer"
          >
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="bg-gray-800 w-full h-full flex items-center justify-center text-green-400 text-3xl font-bold">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex justify-center items-center opacity-0 hover:opacity-100 transition">
              <Camera className="text-green-400" />
            </div>
          </div>
        </div>

        {/* Fields */}
        <Field label="Full Name" value={safeName} editable={isEditingName} setValue={setSafeName} toggleEdit={() => setIsEditingName(!isEditingName)} />
        <Field label="Email" value={email} editable={isEditingEmail} setValue={setEmail} toggleEdit={() => setIsEditingEmail(!isEditingEmail)} icon={<Mail className="text-green-400" />} />
        <Field label="Role" value={role} editable={isEditingRole} setValue={setRole} toggleEdit={() => setIsEditingRole(!isEditingRole)} icon={<User className="text-green-400" />} />

        {hasChanges && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex-1 bg-green-500 text-black px-5 py-3 rounded-xl font-bold"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={handleCancel} className="px-5 py-3 bg-gray-700 rounded-xl text-white">
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* 🔴 LOGOUT */}
      <div className="bg-red-500/10 border border-red-500/40 p-5 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogOut className="text-red-400" />
          <p className="text-white font-bold">Log Out</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 px-5 py-2 rounded-xl text-white font-bold flex items-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

// Field component unchanged
const Field = ({ label, value, editable, setValue, toggleEdit, icon }) => (
  <div className="mt-4">
    <label className="text-sm text-green-400 font-bold block mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg flex-1">
        {icon}
        <input
          className="bg-transparent text-white flex-1 focus:outline-none"
          value={value}
          readOnly={!editable}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button
        onClick={toggleEdit}
        className={`p-2 rounded-lg ${editable ? "bg-red-500/30" : "bg-green-500/20"}`}
      >
        {editable ? <X className="text-red-400" /> : <Edit2 className="text-green-400" />}
      </button>
    </div>
  </div>
);

export default SettingsComponent;
