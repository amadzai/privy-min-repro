import { useEffect, useState } from "react";
import { Button } from "./Button";
import { useUnifiedWallet } from "../hooks/useUnifiedWallet";
import { useContractInteraction } from "../hooks/useContractInteraction";
import { extendedERC20ABI } from "../config/abi/ERC20";
import { formatUnits, parseUnits, type Address } from "viem";
import toast from "react-hot-toast";

const ClaimFaucetButton = () => {
  const { address, userBalance, refetchUserBalance, walletType } =
    useUnifiedWallet();
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);

  const faucet = useContractInteraction({
    to: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
    abi: extendedERC20ABI,
    functionName: "faucet",
    args: [BigInt(0)],
    description: "Faucet",
  });

  useEffect(() => {
    if (faucet.isConfirmed && faucet.latestHash) {
      refetchUserBalance();
    }
  }, [faucet.isConfirmed, faucet.latestHash, refetchUserBalance]);

  const claimFaucet = async () => {
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (isClaimingFaucet) {
      return;
    }

    try {
      setIsClaimingFaucet(true);

      const amount = parseUnits("1000", 6);
      await faucet.execute({
        args: [amount],
      });
    } catch (err) {
      console.error("Faucet claim error:", err);
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  const formattedBalance = userBalance
    ? `$${Number(formatUnits(userBalance, 6)).toFixed(2)}`
    : "$0.00";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-medium">Balance: {formattedBalance}</div>

      {walletType && (
        <div className="text-sm text-gray-500">
          Using{" "}
          {walletType === "smart" ? "Privy Smart Wallet" : "Standard Wallet"}
        </div>
      )}

      <Button
        onClick={claimFaucet}
        variant="primary"
        disabled={isClaimingFaucet || faucet.isLoading}
        size="lg"
      >
        {isClaimingFaucet || faucet.isLoading ? "Claiming..." : "Claim Faucet"}
      </Button>

      {faucet.isConfirmed && (
        <div className="text-green-500 mt-2">
          Claim successful! Balance updated.
        </div>
      )}
    </div>
  );
};

export default ClaimFaucetButton;
