//封装高阶组件
//核心逻辑，有token 正常跳转 无token 去登录

import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";

function AuthRoute({ children }) {
  const token = getToken()
  if (token) {
    return <>{children}</>
  } else {
    sessionStorage.clear()
    return <Navigate to={'/login'} replace />
  }
}

export default AuthRoute