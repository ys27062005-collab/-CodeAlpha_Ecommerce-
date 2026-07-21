import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/context/CartContext";
import AuthContext from "@/app/context/AuthContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "SocietyHub - Mumbai Marketplace",
  description: "Local marketplace for society residents in Mumbai",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthContext>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthContext>
      </body>
    </html>
  );
}
