import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect } from "react";

const useSyncUser = () => {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        const token = await getToken();
        await axios.post("http://localhost:5000/api/auth/sync", {
          email_addresses: user.emailAddresses,
          username: user.username || user.id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("✅ User synced to backend");
      } catch (err) {
        console.error("❌ Sync failed", err);
      }
    };

    syncUser();
  }, [user]);
};

export default useSyncUser;
