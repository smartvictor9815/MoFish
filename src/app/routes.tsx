import { Navigate, createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/Home";
import Users from "./components/Users";
import UserAccessLog from "./components/UserAccessLog";
import PdrtEvaluation from "./components/PdrtEvaluation";
import PdrtSdt from "./components/PdrtSdt";
import CustomerIndustry from "./components/CustomerIndustry";
import LifecycleRevenue from "./components/LifecycleRevenue";
import ILearning from "./components/ILearning";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Settings from "./components/Settings";
import { getToken } from "@/lib/session";

function ProtectedRoot() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Root />;
}

function LoginPage() {
  if (getToken()) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: ProtectedRoot,
    children: [
      { index: true, Component: Home },
      { path: "pdrt/evaluation", Component: PdrtEvaluation },
      { path: "pdrt/sdt", Component: PdrtSdt },
      { path: "pdrt/customer-industry", Component: CustomerIndustry },
      { path: "lifecycle/revenue", Component: LifecycleRevenue },
      { path: "other/ilearning", Component: ILearning },
      { path: "system/users", Component: Users },
      { path: "system/access-log", Component: UserAccessLog },
      { path: "system/settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);
