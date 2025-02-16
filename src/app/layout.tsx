import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/ui/navbar";
import { UserProvider } from "@/components/user-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDL - To Do List",
  description: "To Do List",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser();
  const accessToken = (await supabase.auth.getSession()).data.session?.access_token

  
  const user = data?.user ? {
    id: data.user.id,
    email: data.user.email!
  } : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider user={user} accessToken={accessToken} />
          {data?.user && <Navbar />}
          <main className="container mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
