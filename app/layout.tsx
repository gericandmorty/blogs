import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-context/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Code & Thoughts",
    template: "%s | Code & Thoughts",
  },
  description:
    "Personal documentation & life blog of Geric Morit — a developer's notes on Linux, Windows, coding, and the tech journey.",
  keywords: ["developer blog", "linux", "windows", "coding", "documentation", "Geric Morit"],
  authors: [{ name: "Geric Morit", url: "https://www.gericandmorty.codes" }],
  openGraph: {
    title: "Code & Thoughts",
    description: "A developer's documentation of life in code.",
    type: "website",
  },
  icons: {
    icon: "/icons/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
