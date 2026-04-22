import { useEffect, useState } from "react";
import { Search, History } from "lucide-react";
import { apiRequest } from "@/lib/api";

type AccessLogItem = {
  id: number;
  username: string;
  ip: string;
  action: string;
  module: string;
  created_at: string;
  status: "成功" | "失败";
};

export default function UserAccessLog() {
  const [searchTerm, setSearchTerm] = useState("");

  const [accessLogs, setAccessLogs] = useState<AccessLogItem[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const params = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : "";
        const response = await apiRequest<AccessLogItem[]>(`/api/access-logs${params}`);
        setAccessLogs(response);
      } catch (requestError) {
        alert(requestError instanceof Error ? requestError.message : "加载日志失败");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "成功":
        return "bg-green-100 text-green-800";
      case "失败":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <History size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">用户访问记录</h1>
            <p className="text-pink-100 mt-1">查看系统用户访问日志</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="搜索用户名、操作或模块..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>所有状态</option>
            <option>成功</option>
            <option>失败</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>今天</option>
            <option>最近7天</option>
            <option>最近30天</option>
            <option>自定义时间</option>
          </select>
        </div>
      </div>

      {/* Access Log Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            访问日志列表{loading ? "（加载中...）" : ""}
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
                  IP地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  模块
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  访问时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {log.username.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {log.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {log.module}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {formatDatetime(log.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
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
