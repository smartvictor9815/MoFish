import { ClipboardCheck, FileText, Calendar, TrendingUp } from "lucide-react";

export default function PdrtEvaluation() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <ClipboardCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">综评规范性评分</h1>
            <p className="text-blue-100 mt-1">PDRT综合评价规范性评分管理</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">待评分项目</p>
              <p className="text-3xl font-bold text-gray-800">12</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <FileText className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">已完成评分</p>
              <p className="text-3xl font-bold text-gray-800">45</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <ClipboardCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">平均得分</p>
              <p className="text-3xl font-bold text-gray-800">87.5</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="text-blue-600" size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">综评规范性评分</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            该功能模块正在开发中，敬请期待。您可以在这里管理PDRT综合评价规范性评分。
          </p>
        </div>
      </div>
    </div>
  );
}
