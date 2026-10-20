import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const nunito = Nunito({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Little Hero - Life RPG",
  description: "Gamify your life",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}