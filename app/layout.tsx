import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "./context/GameContext";

export const metadata: Metadata = {
  title: "Church Planting Tycoon",
  description: "A management simulation game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col items-center justify-center p-4 bg-[#f0f0f0]">
        <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl min-h-[600px] pixel-box relative overflow-hidden flex flex-col">
            <GameProvider>
                {children}
            </GameProvider>
        </div>
      </body>
    </html>
  );
}
