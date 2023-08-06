import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      return navigate("/");
    }
  }, []);
  return children;
};

export default RequireAuth;
