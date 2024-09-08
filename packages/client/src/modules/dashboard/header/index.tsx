import { Button, Input, Modal, message } from "antd";
import styles from "./index.module.less";
import { useState } from "react";
import { useGlobalStore } from "@/store";
import { useDebounceFn } from "ahooks";
import { Search } from "lucide-react";

export const DashboardHeader = () => {
  const [openShoppingCar, setOpenShoppingCar] = useState(false);
  const [loading, setLoading] = useState(false);

  const shoppingCar = useGlobalStore((state) => state.shoppingCard);

  const searchProducts = useGlobalStore((state) => state.searchProducts);
  const buy = useGlobalStore((state) => state.buy);
  const clearShoppingCard = useGlobalStore((state) => state.clearShoppingCard);
  const removeShoppingItem = useGlobalStore(
    (state) => state.removeShoppingItem
  );

  const { run: debouncedSearch } = useDebounceFn(
    (value: string) => {
      searchProducts(value);
    },
    { wait: 500 }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    debouncedSearch(value);
  };

  const buyAll = async () => {
    setLoading(true);
    const { code, data } = await buy(shoppingCar.map((item) => item._id));
    setLoading(false);
    clearShoppingCard();

    if (data.purchaseFailed.length === 0) {
      setOpenShoppingCar(false);
      return message.success("buy success");
    }

    if (code === -1) {
      return message.error("server error");
    }

    for (const item of data.purchaseFailed) {
      message.error(item.message);
    }
  };

  return (
    <div className={styles.header_container}>
      <div className={styles.left_wrap}>
        <Input
          prefix={<Search size={16} />}
          onInput={handleInputChange}
          placeholder="Enter keywords to start searching"
        />
      </div>

      <div className={styles.right_wrap}>
        <Button type="primary" onClick={() => setOpenShoppingCar(true)}>
          shopping car
        </Button>
        <Button type="primary">create product</Button>
      </div>

      <Modal
        open={openShoppingCar}
        centered
        footer={null}
        onCancel={() => setOpenShoppingCar(false)}
      >
        <h3>Shopping Cart</h3>
        <div className={styles.shopping_car__content}>
          {shoppingCar.length > 0 ? (
            shoppingCar.map((item) => {
              return (
                <>
                  <div className={styles.shopping_car__item} key={item._id}>
                    <div className={styles.shopping_car__left}>
                      <span>{item.name}</span>
                      <span className={styles.price}>${item.price}</span>
                    </div>
                    <Button
                      type="default"
                      onClick={() => removeShoppingItem(item._id)}
                    >
                      remove
                    </Button>
                  </div>
                </>
              );
            })
          ) : (
            <div>empty</div>
          )}
          <div className={styles.btn_wrap}>
            <Button onClick={() => setOpenShoppingCar(false)}>Cancel</Button>
            <Button type="primary" loading={loading} onClick={buyAll}>
              Buy all
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
