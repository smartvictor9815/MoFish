import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  Users,
  User,
  LogOut,
  Key,
  X,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileText,
  TrendingUp,
  GraduationCap,
  Settings,
  History,
  Home,
  Menu,
  PanelLeftClose,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { clearToken, getToken } from "@/lib/session";

type NavItem = {
  path: string;
  icon: any;
  label: string;
  children?: NavItem[];
};

export default function Root() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [currentUsername, setCurrentUsername] = useState("管理员");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { path: "/", icon: Home, label: "首页" },
    {
      path: "/pdrt",
      icon: ClipboardCheck,
      label: "PDRT运作",
      children: [
        { path: "/pdrt/evaluation", icon: FileText, label: "综评规范性评分" },
        { path: "/pdrt/sdt", icon: FileText, label: "SDT决策记录" },
        { path: "/pdrt/customer-industry", icon: FileText, label: "客户行业信息" },
      ]
    },
    {
      path: "/lifecycle",
      icon: TrendingUp,
      label: "生命周期管理",
      children: [
        { path: "/lifecycle/revenue", icon: TrendingUp, label: "项目收入进展" },
      ]
    },
    {
      path: "/other",
      icon: GraduationCap,
      label: "其他",
      children: [
        { path: "/other/ilearning", icon: GraduationCap, label: "iLearning考试" },
      ]
    },
    {
      path: "/system",
      icon: Settings,
      label: "系统管理",
      children: [
        { path: "/system/users", icon: Users, label: "用户管理" },
        { path: "/system/access-log", icon: History, label: "用户访问记录" },
        { path: "/system/settings", icon: Settings, label: "设置" },
      ]
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = (path: string) => {
    if (expandedMenus.includes(path)) {
      setExpandedMenus(expandedMenus.filter(p => p !== path));
    } else {
      setExpandedMenus([...expandedMenus, path]);
    }
  };

  const isMenuExpanded = (path: string) => {
    return expandedMenus.includes(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (sidebarCollapsed) {
      setExpandedMenus([]);
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const sidebar = document.querySelector('aside');
      if (!sidebarCollapsed && sidebar && !sidebar.contains(target)) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
    setUserMenuOpen(false);
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert("请填写所有字段");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("新密码和确认密码不一致");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("密码长度至少6位");
      return;
    }
    setPasswordSubmitting(true);
    try {
      await apiRequest<{ message: string }>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
        }),
      });
      alert("密码修改成功");
      setIsChangePasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      alert(requestError instanceof Error ? requestError.message : "修改密码失败");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    apiRequest<{ username: string }>("/api/auth/me")
      .then((user) => {
        setCurrentUsername(user.username);
      })
      .catch(() => {
        clearToken();
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 fixed left-0 top-0 bottom-0 z-50`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1758691737538-220c1902b1ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxoYXBweSUyMHdvcmslMjBvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzY4NjcyNDJ8MA&ixlib=rb-4.1.0&q=80&w=200"
                  alt="MoFish"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">MoFish</h1>
                <p className="text-xs text-gray-400">More intelligence, More fish</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              title="折叠菜单"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const expanded = isMenuExpanded(item.path);

            return (
              <div key={item.path}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {expanded ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {expanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setSidebarCollapsed(true)}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                                location.pathname === child.path
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                              }`}
                            >
                              <ChildIcon size={16} />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setSidebarCollapsed(true)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{currentUsername}</p>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Key size={16} />
                  <span>更改密码</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>退出登录</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Floating Menu Button (when collapsed) */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-4 top-4 z-30 p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300"
          title="展开菜单"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Main Content */}
      <main className="h-full overflow-auto p-6">
        <Outlet />
      </main>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">更改密码</h2>
              <button
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入当前密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入新密码"
                />
                <p className="text-xs text-gray-500 mt-1">
                  密码长度至少6位
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsChangePasswordModalOpen(false);
                  setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleChangePassword}
                  disabled={
                    passwordSubmitting ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {passwordSubmitting ? "提交中..." : "确认修改"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
