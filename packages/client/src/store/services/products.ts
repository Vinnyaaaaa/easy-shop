import apiClient from "@/api/request";
import { StateCreator } from "zustand";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductsState {
  products: Array<Product>;
  shoppingCard: Array<Product>;
}

interface ProductsAction {
  getAllProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  addToShoppingCart: (product: Product) => void;
  buy: (purchases: Array<string>) => Promise<{
    isSuc: boolean;
    msg: string;
    code: number;
    data: {
      purchaseFailed: Array<{
        productId: string;
        message: string;
        code: number;
      }>;
      purchaseSuccess: Array<{
        productId: string;
        message: string;
        code: number;
      }>;
    };
  }>;

  clearShoppingCard: () => void;
  removeShoppingItem: (id: string) => void;
  loadShoppingCardFromLocalStorage: () => void;
}

export type ProductSlice = ProductsState & ProductsAction;

const initProductsSlice = () => {
  return {
    products: [],
    shoppingCard: [],
  };
};

export const createProductSlice: StateCreator<
  ProductSlice,
  [],
  [["zustand/immer", never]],
  ProductSlice
> = (set, get) => ({
  ...initProductsSlice(),

  getAllProducts: async () => {
    try {
      const { code, data } = await apiClient.get<{
        products: Array<Product>;
      }>("/products");

      if (code === 0) {
        set({ products: data.products });
      }
    } catch (error) {
      console.log("getAllProducts error", error);
    }
  },

  searchProducts: async (query) => {
    try {
      const { code, data } = await apiClient.get<{
        products: Array<Product>;
      }>("/products/search", {
        params: {
          query,
        },
      });
      if (code === 0) {
        set({ products: data.products });
      }
    } catch (error) {
      console.log("searchProducts error", error);
    }
  },

  addToShoppingCart: (product) => {
    const shoppingCard = get().shoppingCard;

    const newShoppingCard = [...shoppingCard, product];

    localStorage.setItem("shoppingCard", JSON.stringify(newShoppingCard));

    set({ shoppingCard: newShoppingCard });
  },

  buy: async (purchases) => {
    try {
      const { code, data, msg } = await apiClient.post<{
        purchaseFailed: Array<{
          productId: string;
          message: string;
          code: number;
        }>;
        purchaseSuccess: Array<{
          productId: string;
          message: string;
          code: number;
        }>;
      }>(`/products/buy`, {
        body: {
          purchases,
        },
      });

      get().getAllProducts();

      return {
        code,
        isSuc: code === 0,
        data,
        msg,
      };
    } catch (error) {
      console.log("buy error", error);

      return {
        isSuc: false,
        msg: "buy failed",
        code: -1,
        data: { purchaseSuccess: [], purchaseFailed: purchases },
      };
    }
  },

  clearShoppingCard: () => {
    localStorage.removeItem("shoppingCard");
    set({ shoppingCard: [] });
  },

  removeShoppingItem: (productId) => {
    const shoppingCard = get().shoppingCard;
    const newShoppingCard = shoppingCard.filter(
      (item) => item._id !== productId
    );
    localStorage.setItem("shoppingCard", JSON.stringify(newShoppingCard));
    set({
      shoppingCard: newShoppingCard,
    });
  },

  loadShoppingCardFromLocalStorage: () => {
    const shoppingCard = localStorage.getItem("shoppingCard");

    if (shoppingCard) {
      set({ shoppingCard: JSON.parse(shoppingCard) });
    }
  },
});
