import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getToken, saveToken } from "@/lib/session";

type BootstrapStatusResponse = {
  needs_bootstrap: boolean;
};

type LoginResponse = {
  access_token: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [bootstrapData, setBootstrapData] = useState({
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showBootstrapPassword, setShowBootstrapPassword] = useState(false);
  const [showBootstrapConfirmPassword, setShowBootstrapConfirmPassword] = useState(false);
  const [checkingBootstrap, setCheckingBootstrap] = useState(true);
  const [needsBootstrap, setNeedsBootstrap] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim()) {
      setError("请输入用户名");
      return;
    }

    if (!formData.password.trim()) {
      setError("请输入密码");
      return;
    }

    setLoading(true);
    try {
      const payload = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
        skipAuth: true,
      });
      saveToken(payload.access_token, formData.rememberMe);
      navigate("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bootstrapData.password.trim()) {
      setError("请设置管理员密码");
      return;
    }
    if (bootstrapData.password.length < 6) {
      setError("密码长度至少6位");
      return;
    }
    if (bootstrapData.password !== bootstrapData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      const payload = await apiRequest<LoginResponse>("/api/auth/bootstrap-admin", {
        method: "POST",
        body: JSON.stringify({ password: bootstrapData.password }),
        skipAuth: true,
      });
      saveToken(payload.access_token, bootstrapData.rememberMe);
      navigate("/");
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "初始化管理员失败";
      if (message.includes("系统已完成初始化")) {
        setNeedsBootstrap(false);
        setFormData((prev) => ({ ...prev, username: "admin" }));
        setError("系统已初始化，请使用管理员账号登录");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      navigate("/");
      return;
    }
    apiRequest<BootstrapStatusResponse>("/api/auth/bootstrap-status", {
      skipAuth: true,
    })
      .then((response) => {
        setNeedsBootstrap(response.needs_bootstrap);
      })
      .catch(() => {
        setError("无法获取系统初始化状态");
      })
      .finally(() => {
        setCheckingBootstrap(false);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white border-opacity-30">
            <img
              src="https://images.unsplash.com/photo-1758691737538-220c1902b1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoYXBweSUyMHdvcmslMjBvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzY4NjcyNDJ8MA&ixlib=rb-4.1.0&q=80&w=400"
              alt="MoFish"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">MoFish</h1>
          <p className="text-blue-100 text-sm">More intelligence, More fish</p>
        </div>

        <div className="p-8">
          {checkingBootstrap ? (
            <p className="text-sm text-gray-600 text-center">正在检查系统初始化状态...</p>
          ) : (
            <form onSubmit={needsBootstrap ? handleBootstrap : handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {needsBootstrap ? (
                <>
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    系统首次使用，请先初始化管理员账号
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">管理员用户名</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        value="admin"
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">设置管理员密码</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400" size={20} />
                      </div>
                      <input
                        type={showBootstrapPassword ? "text" : "password"}
                        value={bootstrapData.password}
                        onChange={(e) =>
                          setBootstrapData({ ...bootstrapData, password: e.target.value })
                        }
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入密码（至少6位）"
                      />
                      <button
                        type="button"
                        onClick={() => setShowBootstrapPassword(!showBootstrapPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showBootstrapPassword ? (
                          <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                        ) : (
                          <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">确认管理员密码</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400" size={20} />
                      </div>
                      <input
                        type={showBootstrapConfirmPassword ? "text" : "password"}
                        value={bootstrapData.confirmPassword}
                        onChange={(e) =>
                          setBootstrapData({
                            ...bootstrapData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请再次输入密码"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowBootstrapConfirmPassword(!showBootstrapConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showBootstrapConfirmPassword ? (
                          <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                        ) : (
                          <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={bootstrapData.rememberMe}
                        onChange={(e) =>
                          setBootstrapData({ ...bootstrapData, rememberMe: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">记住我</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      用户名
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={20} />
                      </div>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入用户名"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400" size={20} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="text-gray-400 hover:text-gray-600" size={20} />
                        ) : (
                          <Eye className="text-gray-400 hover:text-gray-600" size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData({ ...formData, rememberMe: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">记住我</span>
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading
                  ? needsBootstrap
                    ? "初始化中..."
                    : "登录中..."
                  : needsBootstrap
                    ? "初始化管理员并登录"
                    : "登录"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
