import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/gloabal/nav";
import Footer from "@/components/gloabal/footer";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DTC",
    template: "DTC  •  %s",
  },
  description: "Preserve your thoughts. Deliver them to your future self.",
  icons: {
    icon: "/logo.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased relative`}
      >
        <QueryProvider >
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            limit={3}
            style={{
              zIndex: 9999,
              fontFamily: "var(--geist-sans)",
              fontSize: "0.95rem",
              color: "var(--geist-foreground)",
              borderRadius: "1rem",
              transition: "all 0.3s ease-in-out",
            }}
          />

          <NavBar />
          <div className="pt-16 min-h-screen">
            {children}
          </div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
