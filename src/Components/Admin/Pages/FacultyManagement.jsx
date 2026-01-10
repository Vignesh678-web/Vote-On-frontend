import React, { useEffect, useState } from "react";
import axios from "axios";
import FacultyList from "./FacultyList";
import Addteacher from "./AddTeacher";


const FacultyManagement = () => {
  const [teachers, setTeachers] = useState([]);

  // FETCH ALL TEACHERS
 const fetchTeachers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/admin/teacher/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTeachers(res.data.teachers);
  } catch (err) {
    console.error("Fetch teachers failed:", err.response?.data || err.message);
  }
};
  // TOGGLE BLOCK — MUST RECEIVE _id
 const handleToggleBlock = async (teacherId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.patch(
      `http://localhost:5000/api/admin/teacher/toggle-block/${teacherId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTeachers();
  } catch (err) {
    console.error(
      "Toggle block failed:",
      err.response?.data || err.message
    );
  }
};


  useEffect(() => {
    fetchTeachers();
  }, []);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-400">
        Faculty Management
      </h2>

             <div className="mb-6">
       <Addteacher
  onAddTeacher={async (newTeacher) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin not authenticated");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/admin/teacher/create",
        newTeacher,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTeachers();
    } catch (err) {
      console.error(
        "Add teacher failed:",
        err.response?.data || err.message
      );
    }
  }}
/>

      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FacultyList
          teachers={teachers}
          onToggleBlock={handleToggleBlock}
        />
      </div>
    </div>
  );
};

export default FacultyManagement;
