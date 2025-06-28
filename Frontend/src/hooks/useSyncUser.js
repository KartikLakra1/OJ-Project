import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const useSyncUser = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      const token = await getToken();
      if (!token) return console.warn("⛔ No token available");

      console.log("📨 Syncing user:");
      console.log("Email:", user.primaryEmailAddress?.emailAddress);
      console.log("Username:", user.firstName || user.username || user.id);

      try {

        const payload = {
  email: user.primaryEmailAddress?.emailAddress,
  username: user.firstName || user.username || user.id,
};

console.log("🛰️ Payload sent to backend:", payload);
        await axios.post(
          "http://localhost:5000/api/auth/sync",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ User synced to backend");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("❌ Sync failed", {
            status: err.response?.status,
            message: err.message,
            data: err.response?.data,
          });
        } else {
          console.error("❌ Unknown sync error", err);
        }
      }
    };

    syncUser();
  }, [user, getToken]);
};

export default useSyncUser;
