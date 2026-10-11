import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nijer Bazaar — Your Neighbourhood Market, Now Online",
  description: "Discover and shop from your favourite local stores. Fresh vegetables, groceries, fish, meat, dairy and everyday essentials from neighbourhood shops in Kolkata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="demo-banner">
          🏪 Interactive Demo — All shops, products, prices, customers, and orders are fictional. No real payments or transactions.
        </div>
        {children}
      </body>
    </html>
  );
}
