import { useState } from "react";
import { Search, Plus, Edit, Trash2, X, Building2 } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  industry: string;
  region: string;
  level: "重点客户" | "普通客户";
  contact: string;
  createdAt: string;
};

export default function CustomerIndustry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    region: "",
    level: "普通客户" as "重点客户" | "普通客户",
    contact: "",
  });

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: "华为技术有限公司",
      industry: "通信设备",
      region: "华南",
      level: "重点客户",
      contact: "张经理",
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      name: "中国建设银行",
      industry: "金融",
      region: "华北",
      level: "重点客户",
      contact: "李经理",
      createdAt: "2025-02-20",
    },
    {
      id: 3,
      name: "阿里云计算",
      industry: "互联网",
      region: "华东",
      level: "重点客户",
      contact: "王经理",
      createdAt: "2025-03-10",
    },
  ]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    return level === "重点客户" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";
  };

  const handleAddCustomer = () => {
    if (!formData.name.trim()) return;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newCustomer: Customer = {
      id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
      name: formData.name,
      industry: formData.industry,
      region: formData.region,
      level: formData.level,
      contact: formData.contact,
      createdAt: timestamp,
    };

    setCustomers([...customers, newCustomer]);
    setIsAddModalOpen(false);
    setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
  };

  const handleEditCustomer = () => {
    if (!selectedCustomer || !formData.name.trim()) return;

    setCustomers(customers.map(customer =>
      customer.id === selectedCustomer.id
        ? { ...customer, ...formData }
        : customer
    ));
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
    setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id));
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      industry: customer.industry,
      region: customer.region,
      level: customer.level,
      contact: customer.contact,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <Building2 size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">客户行业信息</h1>
              <p className="text-blue-100 mt-1">管理客户及行业分类信息</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
          >
            <Plus size={20} />
            <span>添加客户</span>
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
              placeholder="搜索客户名称或行业..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">客户列表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  行业
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  区域
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  客户级别
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(customer.level)}`}
                    >
                      {customer.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {customer.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(customer)}
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
              <h2 className="text-xl font-semibold text-gray-800">添加客户</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入客户名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行业
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入行业"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  区域
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入区域"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户级别
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as "重点客户" | "普通客户" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="普通客户">普通客户</option>
                  <option value="重点客户">重点客户</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系人
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入联系人"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddCustomer}
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
              <h2 className="text-xl font-semibold text-gray-800">编辑客户</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCustomer(null);
                  setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入客户名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  行业
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入行业"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  区域
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入区域"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  客户级别
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as "重点客户" | "普通客户" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="普通客户">普通客户</option>
                  <option value="重点客户">重点客户</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系人
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入联系人"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCustomer(null);
                  setFormData({ name: "", industry: "", region: "", level: "普通客户", contact: "" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEditCustomer}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">删除客户</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                确定要删除客户 <span className="font-semibold text-gray-800">{selectedCustomer.name}</span> 吗？此操作无法撤销。
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
