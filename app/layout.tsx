import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "./components/Chatbot";
import AuthProvider from "./components/AuthProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
