import React, { useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl"; // Get API URL

function Welcompage() {
  let apiUrl = getApiUrl();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const UserName = localStorage.getItem("username");
  const userId = localStorage.getItem("userId"); // Ensure userId is stored in localStorage

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      // Call the API to change the password
      const response = await axios.patch(
        `${apiUrl}/api/users/change-password/${userId}`,
        {
          currentPassword,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "An error occurred"
      );
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {UserName} to Addis Ababa Transport Bureau Bole Branch Admin
        Page!
      </h1>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
        >
          Change Password
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default Welcompage;
