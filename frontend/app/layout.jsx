import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import StoreInitializer from "@/components/StoreInitializer";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Trendly. - Shop smarter",
    description: "Trendly. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <StoreInitializer>
                            <Toaster />
                            {children}
                        </StoreInitializer>
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
