import { usePrivy } from "@privy-io/react-auth";
import WalletConnectButton from "../components/WalletConnectButton";
import ClaimFaucetButton from "../components/ClaimFaucetButton";

export default function Home() {
  const { authenticated } = usePrivy();

  return (
    <div className="w-full flex min-h-screen items-center justify-center gap-5 flex-col">
      <h1 className="text-2xl font-bold mb-4">Min Repro</h1>
      <WalletConnectButton />

      {authenticated && (
        <div className="mt-6">
          <ClaimFaucetButton />
        </div>
      )}
    </div>
  );
}
