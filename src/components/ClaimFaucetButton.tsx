import { useEffect, useState } from "react";
import { Button } from "./Button";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { extendedERC20ABI } from "../config/abi/ERC20";
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  type Address,
} from "viem";
import toast from "react-hot-toast";

const ClaimFaucetButton = () => {
  const { client: smartWalletClient } = useSmartWallets();
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const address = smartWalletClient?.account?.address;

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
    abi: extendedERC20ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchOnWindowFocus: true,
    },
  });

  const userBalance = balanceData ? BigInt(balanceData.toString()) : BigInt(0);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
    }
  }, [isSuccess, refetchBalance]);

  const claimFaucet = async () => {
    if (!smartWalletClient || !address) {
      toast.error("Smart wallet not initialized");
      return;
    }

    if (isClaimingFaucet) {
      return;
    }

    try {
      setIsClaimingFaucet(true);

      const amount = parseUnits("1000", 6);
      const data = encodeFunctionData({
        abi: extendedERC20ABI,
        functionName: "faucet",
        args: [amount],
      });

      const hash = await smartWalletClient.sendTransaction(
        {
          to: process.env.NEXT_PUBLIC_COLLATERAL_ADDRESS as Address,
          data,
          value: BigInt(0),
          account: smartWalletClient.account,
          chain: smartWalletClient.chain,
        },
        {
          uiOptions: {
            description: "Claim Faucet",
          },
        }
      );

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

  const formattedBalance = userBalance
    ? `$${Number(formatUnits(userBalance, 6)).toFixed(2)}`
    : "$0.00";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-medium">Balance: {formattedBalance}</div>

      <div className="text-sm text-gray-500">Using Privy Smart Wallet</div>

      <Button
        onClick={claimFaucet}
        variant="primary"
        disabled={isClaimingFaucet || !smartWalletClient}
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
