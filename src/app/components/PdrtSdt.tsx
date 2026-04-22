import { FileText, Users, CheckCircle, Clock } from "lucide-react";

export default function PdrtSdt() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SDT决策记录</h1>
            <p className="text-green-100 mt-1">SDT决策记录管理</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">待审核决策</p>
              <p className="text-3xl font-bold text-gray-800">8</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">已批准决策</p>
              <p className="text-3xl font-bold text-gray-800">156</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">参与人数</p>
              <p className="text-3xl font-bold text-gray-800">23</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-green-600" size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">SDT决策记录</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            该功能模块正在开发中，敬请期待。您可以在这里管理和查看所有SDT决策记录。
          </p>
        </div>
      </div>
    </div>
  );
}
