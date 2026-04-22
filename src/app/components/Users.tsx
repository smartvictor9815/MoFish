import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, X, Key, Users as UsersIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";

type User = {
  id: number;
  name: string;
  role: "管理员" | "用户";
  status: "活跃" | "禁用";
  createdAt: string;
  lastVisit: string;
};

type ApiUser = {
  id: number;
  username: string;
  role: "管理员" | "用户";
  status: "活跃" | "禁用";
  created_at: string;
  last_visit: string;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "用户" as "管理员" | "用户",
    status: "活跃" as "活跃" | "禁用",
    password: "hw12345",
  });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);

  const formatDatetime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    const h = `${date.getHours()}`.padStart(2, "0");
    const min = `${date.getMinutes()}`.padStart(2, "0");
    const s = `${date.getSeconds()}`.padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
  };

  const mapApiUser = (user: ApiUser): User => ({
    id: user.id,
    name: user.username,
    role: user.role,
    status: user.status,
    createdAt: formatDatetime(user.created_at),
    lastVisit: formatDatetime(user.last_visit),
  });

  const loadUsers = async (query = "") => {
    setLoading(true);
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : "";
      const response = await apiRequest<ApiUser[]>(`/api/users${params}`);
      setUsers(response.map(mapApiUser));
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "加载用户失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadUsers(searchTerm);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const filteredUsers = users;

  const getRoleColor = (role: string) => {
    return role === "管理员" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800";
  };

  const getStatusColor = (status: string) => {
    return status === "活跃" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleAddUser = async () => {
    if (!formData.name.trim()) return;
    try {
      await apiRequest<ApiUser>("/api/users", {
        method: "POST",
        body: JSON.stringify({
          username: formData.name.trim(),
          role: formData.role,
          status: formData.status,
          password: formData.password,
        }),
      });
      setIsAddModalOpen(false);
      setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
      await loadUsers(searchTerm);
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "添加用户失败");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser || !formData.name.trim()) return;
    try {
      await apiRequest<ApiUser>(`/api/users/${selectedUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          username: formData.name.trim(),
          role: formData.role,
          status: formData.status,
        }),
      });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
      await loadUsers(searchTerm);
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "编辑用户失败");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await apiRequest<{ message: string }>(`/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      await loadUsers(searchTerm);
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "删除用户失败");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      status: user.status,
      password: "hw12345",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword.trim()) return;
    try {
      await apiRequest<{ message: string }>(`/api/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ new_password: newPassword }),
      });
      alert(`已为用户 ${selectedUser.name} 重置密码`);
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
      setNewPassword("");
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "重置密码失败");
    }
  };

  const isAdminUsernameLocked = selectedUser?.name === "admin";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <UsersIcon size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">用户管理</h1>
              <p className="text-indigo-100 mt-1">管理系统所有用户</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
          >
            <Plus size={20} />
            <span>添加用户</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="搜索用户名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            用户列表{loading ? "（加载中...）" : ""}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最近访问
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openResetPasswordModal(user)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="重置密码"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">添加用户</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isAdminUsernameLocked}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名"
                />
                {isAdminUsernameLocked && (
                  <p className="text-xs text-gray-500 mt-2">admin 用户名固定，不能修改</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "管理员" | "用户" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="用户">用户</option>
                  <option value="管理员">管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "活跃" | "禁用" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="活跃">活跃</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddUser}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">编辑用户</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                  setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  角色
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as "管理员" | "用户" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="用户">用户</option>
                  <option value="管理员">管理员</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "活跃" | "禁用" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="活跃">活跃</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                  setFormData({ name: "", role: "用户", status: "活跃", password: "hw12345" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEditUser}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">删除用户</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                确定要删除用户 <span className="font-semibold text-gray-800">{selectedUser.name}</span> 吗？此操作无法撤销。
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">重置密码</h2>
              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setSelectedUser(null);
                  setNewPassword("");
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  正在为用户 <span className="font-semibold">{selectedUser.name}</span> 重置密码
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入新密码"
                />
                <p className="text-xs text-gray-500 mt-2">
                  密码长度至少6位
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setSelectedUser(null);
                  setNewPassword("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleResetPassword}
                disabled={!newPassword.trim() || newPassword.length < 6}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                重置密码
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
