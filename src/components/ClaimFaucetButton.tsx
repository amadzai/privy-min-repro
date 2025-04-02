import { useEffect, useState } from "react";
import { Button } from "./Button";
import { usePrivy } from "@privy-io/react-auth";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
} from "wagmi";
import { extendedERC20ABI } from "../config/abi/ERC20";
import { formatUnits, parseUnits, type Address } from "viem";
import toast from "react-hot-toast";

const ClaimFaucetButton = () => {
  const { authenticated } = usePrivy();
  const { address } = useAccount();
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);

  // Direct contract write call
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  // Read user balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });
  const userBalance = balanceData ? BigInt(balanceData.toString()) : BigInt(0);

  // Watch for transaction confirmation
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Update balance when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
    }
  }, [isSuccess, refetchBalance]);

  const claimFaucet = async () => {
    if (!authenticated || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (isClaimingFaucet) {
      return; // Prevent double clicks
    }

    try {
      setIsClaimingFaucet(true);

      // Execute faucet transaction directly
      const amount = parseUnits("1000", 6);
      const hash = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
        abi: extendedERC20ABI,
        functionName: "faucet",
        args: [amount],
      });

      setTxHash(hash);
      toast.success("Faucet claim initiated");
    } catch (err) {
      console.error("Faucet claim error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to claim from faucet"
      );
    } finally {
      setIsClaimingFaucet(false);
    }
  };

  // Format the balance (assuming 6 decimals for USDT)
  const formattedBalance = userBalance
    ? `$${Number(formatUnits(userBalance, 6)).toFixed(2)}`
    : "$0.00";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-medium">Balance: {formattedBalance}</div>

      <Button
        onClick={claimFaucet}
        variant="primary"
        disabled={isClaimingFaucet}
        size="lg"
      >
        {isClaimingFaucet ? "Claiming..." : "Claim Faucet"}
      </Button>

      {isSuccess && (
        <div className="text-green-500 mt-2">
          Claim successful! Balance updated.
        </div>
      )}
    </div>
  );
};

export default ClaimFaucetButton;
