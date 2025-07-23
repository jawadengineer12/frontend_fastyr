"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <main className="">{children}</main>
    </Provider>
  );
}
