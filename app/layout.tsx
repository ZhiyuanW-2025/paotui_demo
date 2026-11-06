import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "校内搭把手 · 校园跑腿互助平台",
  description: "校园任务发布、接单、沟通与结算，支持五校隔离的作品演示。",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
