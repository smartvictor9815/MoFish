import { TrendingUp, DollarSign, BarChart3, Target } from "lucide-react";

export default function LifecycleRevenue() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">项目收入进展</h1>
            <p className="text-purple-100 mt-1">项目生命周期收入进展管理</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总收入</p>
              <p className="text-3xl font-bold text-gray-800">¥2.4M</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">目标完成率</p>
              <p className="text-3xl font-bold text-gray-800">78%</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <Target className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">活跃项目</p>
              <p className="text-3xl font-bold text-gray-800">34</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="text-purple-600" size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">项目收入进展</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            该功能模块正在开发中，敬请期待。您可以在这里跟踪和管理项目生命周期的收入进展。
          </p>
        </div>
      </div>
    </div>
  );
}
