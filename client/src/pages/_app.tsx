import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { UserDefinition } from ".";

const lightTheme = createTheme({
  type: "light",
  theme: {},
});

const darkTheme = createTheme({
  type: "dark",
  theme: {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [user, setCurrentUser] = useState<UserDefinition>({
    avatar: "",
    username: "",
    loggedIn: false,
  });
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
            <Component
              {...pageProps}
              user={user}
              setCurrentUser={setCurrentUser}
            />
          </main>
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
}
