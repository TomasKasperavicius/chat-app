import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider, createTheme } from "@nextui-org/react";
// 1. Import `createTheme`
import { ThemeProvider as NextThemesProvider} from 'next-themes';

// 2. Call `createTheme` and pass your custom values
const lightTheme = createTheme({
  type: 'light',
  theme: {
    //colors: {...}, // optional
  }
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    //colors: {...}, // optional
  }
})

export default function App({ Component, pageProps }: AppProps) {
  

  return (
    <NextThemesProvider
    defaultTheme="system"
    attribute="class"
    value={{
      light: lightTheme.className,
      dark: darkTheme.className
    }}
  >
  <NextUIProvider>
    <Component {...pageProps} />
  </NextUIProvider>
</NextThemesProvider>
    
  )
}
