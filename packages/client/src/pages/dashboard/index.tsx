import { useGlobalStore } from "@/store";
import { useEffect } from "react";
import styles from "./index.module.less";
import { DashboardHeader } from "@/modules/dashboard/header";
import { ProductList } from "@/modules/dashboard/product-list";
import { useAsyncEffect } from "ahooks";

const Dashboard = () => {
  const getAllProducts = useGlobalStore((state) => state.getAllProducts);
  const loadShoppingCardFromLocalStorage = useGlobalStore(
    (state) => state.loadShoppingCardFromLocalStorage
  );

  useAsyncEffect(async () => {
    await getAllProducts();

    loadShoppingCardFromLocalStorage();
  });
  return (
    <div className={styles.dashboard_wrap}>
      <DashboardHeader />

      <ProductList />
    </div>
  );
};

export default Dashboard;
