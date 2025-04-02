import WalletConnectButton from "./WalletConnectButton";

export default function Home() {
  return (
    <div className="w-full flex min-h-screen items-center justify-center gap-5 flex-col">
      <h1 className="text-2xl font-bold mb-4">Min Repro</h1>
      <WalletConnectButton />
    </div>
  );
}
