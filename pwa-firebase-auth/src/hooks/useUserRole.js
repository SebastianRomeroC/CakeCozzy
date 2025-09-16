import { useEffect, useState } from "react";
import { auth } from "../firebase";

export function useUserRole() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const adminEmails = ["kuiner6@gmail.com"]; // 👈 cámbialo por el tuyo
        if (adminEmails.includes(user.email)) {
          setRole("admin");
        } else {
          setRole("user");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { role, loading };
}
