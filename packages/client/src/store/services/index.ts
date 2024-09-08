import { create } from "zustand";
import { UserSlice, createUserSlice } from "./user";
import { ProductSlice, createProductSlice } from "./products";

type StoreStates = UserSlice & ProductSlice;

export const globalStore = create<StoreStates>()((...arg) => ({
  ...createUserSlice(...arg),
  ...createProductSlice(...arg),
}));

export const useGlobalStore = globalStore;
