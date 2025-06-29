// src/hooks/useUserRole.js
import { useEffect, useState } from "react";
import useApi from "../Utils/api";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get("/auth/me");
        setRole(res.data.role); // assuming backend returns { role: 'admin' }
      } catch (err) {
        console.error("Failed to fetch role:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  return { role, loading };
};

export default useUserRole;
