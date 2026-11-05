import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <h2>Loading profile...</h2>;

  if (!profile) return <h2>Profile not found.</h2>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>User Dashboard</h1>
      <p>Welcome back, {profile.name}!</p>

      <h2>My Profile</h2>

      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDashboard;
