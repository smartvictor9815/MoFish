import { GraduationCap, BookOpen, Award, Users } from "lucide-react";

export default function ILearning() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">iLearning考试</h1>
            <p className="text-orange-100 mt-1">iLearning在线考试管理</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">进行中的考试</p>
              <p className="text-3xl font-bold text-gray-800">5</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <BookOpen className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">已完成考试</p>
              <p className="text-3xl font-bold text-gray-800">89</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <Award className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">参与学员</p>
              <p className="text-3xl font-bold text-gray-800">128</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="text-orange-600" size={48} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">iLearning考试</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            该功能模块正在开发中，敬请期待。您可以在这里管理和组织iLearning在线考试。
          </p>
        </div>
      </div>
    </div>
  );
}
