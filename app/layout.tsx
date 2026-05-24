import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lexy's Kitchen | Soul Food, Cakes & Catering",
  description: "Canada-based Soul Food, Cakes, and Catering. We are only accepting scheduled orders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
