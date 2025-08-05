import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a New Listing – FijiMarket",
  description: "Fill out the form to post a new item for sale on FijiMarket.",
};

export default function ListingsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
