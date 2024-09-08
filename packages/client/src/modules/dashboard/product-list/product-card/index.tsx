import styles from "./index.module.less";
import { Button, Image, message } from "antd";
import testImag from "@/assets/images/product-img.jpeg";
import { useGlobalStore } from "@/store";
import { useMemo, useState } from "react";

interface Props {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  describe?: string;
}
export const ProductCard = ({
  _id,
  name,
  price,
  stock,
  category,
  describe,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const buy = useGlobalStore((state) => state.buy);
  const addToCart = useGlobalStore((state) => state.addToShoppingCart);
  const removeShoppingItem = useGlobalStore(
    (state) => state.removeShoppingItem
  );
  const shoppingCard = useGlobalStore((state) => state.shoppingCard);

  const handleBuy = async () => {
    setLoading(true);
    const { data, code } = await buy([_id]);
    setLoading(false);
    if (data.purchaseFailed.length === 0) {
      return message.success("buy success");
    }

    if (code === -1) {
      return message.error("server error");
    }

    for (const item of data.purchaseFailed) {
      message.error(item.message);
    }
  };

  const handleAddToCart = () => {
    addToCart({ _id, name, price, stock, category });
  };

  const isInCart = useMemo(() => {
    return shoppingCard.some((item) => item._id === _id);
  }, [_id, shoppingCard]);

  return (
    <div className={styles.product_card__wrap}>
      <Image src={testImag} preview={false} />
      <div className={styles.info}>
        <h3 className={styles.brand}>{category}</h3>
        <p className={styles.model}>{name}</p>
        <p className={styles.price}>${price}</p>
      </div>

      <div className={styles.btn_wrap}>
        <Button
          type="primary"
          onClick={() => {
            if (isInCart) {
              removeShoppingItem(_id);
              return;
            }

            handleAddToCart();
          }}
        >
          {isInCart ? "remove" : "add to the cart"}
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={handleBuy}
          disabled={stock === 0}
        >
          Buy
        </Button>
      </div>
    </div>
  );
};
