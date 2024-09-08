import { useGlobalStore } from "@/store";
import styles from "./index.module.less";
import { ProductCard } from "./product-card";
export const ProductList = () => {
  const products = useGlobalStore((state) => state.products);

  return (
    <div className={styles.product_list__wrap}>
      {products.length > 0 ? (
        products.map((item) => {
          return <ProductCard {...item} key={item._id} />;
        })
      ) : (
        <div className={styles.empty_status}>No Products</div>
      )}
    </div>
  );
};
