import { useSpendingStore } from "@/store/spendingStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const DataInitializer = () => {
  const session = useSession();
  const { setTotal, wife, husband, setMyRole } = useSpendingStore();

  useEffect(() => {
    if (session.data?.user?.email === "mun05170@gmail.com") {
      setMyRole("husband");
    } else if (session.data?.user?.email === "mvs1479@gmail.com") {
      setMyRole("wife");
    }
  }, [session.data?.user?.email, setMyRole]);

  useEffect(() => {
    setTotal(husband, wife);
  }, [setTotal, wife, husband]);

  // 앱 최초 진입 시 zustand store를 localStorage에서 불러오기
  useEffect(() => {
    useSpendingStore.getState().loadFromStorage();
  }, []);

  return null;
};

export default DataInitializer;
