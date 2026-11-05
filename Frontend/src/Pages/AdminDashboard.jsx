import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const usersSnapshot = await getDocs(collection(db, "users"));

      const usersList = usersSnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      alert("Role updated successfully!");
    } catch (error) {
      console.error("Role update error:", error);
      alert("Unable to update role.");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Statistics
  const totalUsers = users.length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalNormalUsers = users.filter((user) => user.role === "user").length;

  // Search
  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <h2>Loading users...</h2>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>

      <button onClick={handleLogout}>Logout</button>

      <h2>Statistics</h2>
      <p>Total Users: {totalUsers}</p>
      <p>Normal Users: {totalNormalUsers}</p>
      <p>Total Admins: {totalAdmins}</p>

      <h2>User Management</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={fetchUsers}>Refresh Users</button>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Manage Role</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  disabled={user.id === auth.currentUser?.uid}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
