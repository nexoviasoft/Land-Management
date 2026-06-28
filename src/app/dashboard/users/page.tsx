"use client";

import React from "react";
import Image from "next/image";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} from "@/redux/api/usersApiSlice";
import UserCreateModal from "./components/UserCreateModal";
import UserEditModal from "./components/UserEditModal";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "partner" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  Nid: string;
  picture: string | null;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: responseData, error, isLoading } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  const users: User[] = responseData?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id).unwrap();
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  const handleToggleBan = async (id: string, isCurrentlyBanned: boolean) => {
    try {
      if (isCurrentlyBanned) {
        await unbanUser(id).unwrap();
      } else {
        await banUser(id).unwrap();
      }
    } catch (error) {
      console.error(error);
      alert(`Error trying to ${isCurrentlyBanned ? "unban" : "ban"} user`);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading users.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </div>

      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UserEditModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal border-b">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email / Phone</th>
              <th className="py-3 px-6">NID</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 flex items-center gap-3">
                    {user.picture ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-200">
                        <Image
                          src={user.picture.startsWith('http') ? user.picture : `http://localhost:8000${user.picture}`}
                          alt={user.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </td>
                  <td className="py-3 px-6">
                    <div>{user.email}</div>
                    <div className="text-xs text-gray-400">{user.phone}</div>
                  </td>
                  <td className="py-3 px-6">{user.Nid}</td>
                  <td className="py-3 px-6 capitalize">{user.role}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isBanned
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center flex justify-center gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/users/${user.id}`)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleBan(user.id, user.isBanned)}
                      className={`px-3 py-1 text-xs font-medium rounded-md text-white transition ${
                        user.isBanned
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
