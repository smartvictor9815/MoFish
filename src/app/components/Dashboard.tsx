import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const stats = [
    {
      title: "总用户",
      value: "2,543",
      change: "+12.5%",
      isIncrease: true,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "订单数",
      value: "1,234",
      change: "+8.2%",
      isIncrease: true,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "总收入",
      value: "¥45,678",
      change: "+15.3%",
      isIncrease: true,
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "增长率",
      value: "23.5%",
      change: "-2.4%",
      isIncrease: false,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const chartData = [
    { month: "1月", users: 400, revenue: 2400 },
    { month: "2月", users: 300, revenue: 1398 },
    { month: "3月", users: 500, revenue: 3800 },
    { month: "4月", users: 780, revenue: 3908 },
    { month: "5月", users: 890, revenue: 4800 },
    { month: "6月", users: 1200, revenue: 5800 },
  ];

  const recentUsers = [
    { id: 1, name: "张三", email: "zhang@example.com", status: "活跃", date: "2026-04-20" },
    { id: 2, name: "李四", email: "li@example.com", status: "活跃", date: "2026-04-21" },
    { id: 3, name: "王五", email: "wang@example.com", status: "待审核", date: "2026-04-22" },
    { id: 4, name: "赵六", email: "zhao@example.com", status: "活跃", date: "2026-04-22" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回来，管理员</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.isIncrease ? (
                      <ArrowUp size={16} className="text-green-500" />
                    ) : (
                      <ArrowDown size={16} className="text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        stat.isIncrease ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            用户增长趋势
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                name="用户数"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            收入统计
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="收入 (¥)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">最近注册用户</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册日期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "活跃"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
