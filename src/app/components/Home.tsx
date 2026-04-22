import { Link } from "react-router";
import {
  ClipboardCheck,
  FileText,
  TrendingUp,
  GraduationCap,
  Users,
  History,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const quickLinks = [
    {
      title: "综评规范性评分",
      description: "PDRT综合评价规范性评分管理",
      icon: ClipboardCheck,
      path: "/pdrt/evaluation",
      color: "bg-blue-500",
    },
    {
      title: "SDT决策记录",
      description: "SDT决策记录管理",
      icon: FileText,
      path: "/pdrt/sdt",
      color: "bg-green-500",
    },
    {
      title: "项目收入进展",
      description: "项目生命周期收入进展管理",
      icon: TrendingUp,
      path: "/lifecycle/revenue",
      color: "bg-purple-500",
    },
    {
      title: "iLearning考试",
      description: "iLearning在线考试管理",
      icon: GraduationCap,
      path: "/other/ilearning",
      color: "bg-orange-500",
    },
    {
      title: "用户管理",
      description: "管理系统所有用户",
      icon: Users,
      path: "/system/users",
      color: "bg-indigo-500",
    },
    {
      title: "用户访问记录",
      description: "查看系统用户访问日志",
      icon: History,
      path: "/system/access-log",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">欢迎使用 HappyWork</h1>
          <p className="text-xl text-blue-100 mb-2">More intelligence, More fish</p>
          <p className="text-blue-100">
            HappyWork是一个智能化的项目管理和协作平台，帮助团队提高工作效率，实现更好的协作。
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">快捷入口</h2>
          <p className="text-gray-600">选择一个模块开始使用</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                to={link.path}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${link.color} p-4 rounded-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">系统概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">总用户数</p>
                <p className="text-3xl font-bold text-gray-800">128</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">活跃项目</p>
                <p className="text-3xl font-bold text-gray-800">45</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">待处理任务</p>
                <p className="text-3xl font-bold text-gray-800">23</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ClipboardCheck className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">今日访问</p>
                <p className="text-3xl font-bold text-gray-800">567</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <History className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">最近活动</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {[
              { user: "张三", action: "更新了项目收入进展", time: "5分钟前" },
              { user: "李四", action: "提交了综评规范性评分", time: "15分钟前" },
              { user: "王五", action: "完成了iLearning考试", time: "30分钟前" },
              { user: "赵六", action: "添加了新的SDT决策记录", time: "1小时前" },
              { user: "孙七", action: "登录了系统", time: "2小时前" },
            ].map((activity, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
