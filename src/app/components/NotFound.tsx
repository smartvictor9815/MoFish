import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">页面未找到</h1>
      <p className="text-gray-600 mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} />
          <span>返回首页</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回上一页</span>
        </button>
      </div>
    </div>
  );
}
