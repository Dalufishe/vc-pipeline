import "@radix-ui/themes/styles.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { Theme } from "@radix-ui/themes";
import FlowProvider from "@/provider/FlowProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme>
      <FlowProvider>
        <main className="bg-bg text-black">
          <Component {...pageProps} />
        </main>
      </FlowProvider>
    </Theme>
  );
}
