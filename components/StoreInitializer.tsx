"use client";

import { fetchSpendingList } from "@/app/actions";
import { useSpendingStore } from "@/store/spendingStore";
import { useSession } from "next-auth/react";

import { useEffect } from "react";

const StoreInitializer = () => {
  const session = useSession();

  const setMyRole = useSpendingStore((state) => state.setMyRole);
  const setSpendingList = useSpendingStore((state) => state.setSpendingList);
  const setIsLoading = useSpendingStore((state) => state.setIsLoading);

  useEffect(() => {
    if (session.data?.user?.email === "mun05170@gmail.com") {
      setMyRole("husband");
    } else if (session.data?.user?.email === "mvs1479@gmail.com") {
      setMyRole("wife");
    }
  }, [session.data?.user?.email, setMyRole]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const spendingList = await fetchSpendingList();
      if (spendingList) {
        setSpendingList(spendingList);
      }
      setIsLoading(false);
    }
    load();
  }, [setSpendingList, setIsLoading]);
  return null;
};

export default StoreInitializer;
