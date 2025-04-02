import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "@/config/wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { scrollSepolia, scroll } from "viem/chains";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: scrollSepolia,
        supportedChains: [scrollSepolia, scroll],
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "all-users",
          showWalletUIs: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <SmartWalletsProvider>
            <Component {...pageProps} />
          </SmartWalletsProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
