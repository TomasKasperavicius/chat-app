import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const lightTheme = createTheme({
  type: "light",
  theme: {
    //colors: {...}, // optional
  },
});

const darkTheme = createTheme({
  type: "dark",
  theme: {
    //colors: {...}, // optional
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <NextThemesProvider
        defaultTheme="system"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <main className="w-full h-screen">
          <Component {...pageProps} />
          </main>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
