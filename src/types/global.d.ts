type AssetSymbol = "ETH" | "BTC" | "USD";

type AppAsset = {
  id: number;
  name: string;
  symbol: string;
  type: string;
};

type TransferAction = "transfer-funds" | "withdraw-funds";

interface TransferJobData {
  actionType: TransferAction;
  balanceId: number;
  amountToTransfer: number;
  transferTo: number; // Wallet Id of the receiver
  assetInfo: AppAsset;
}

interface WithdrawJobData {
  actionType: TransferAction;
  balanceId: number;
  amountToWithdraw: number;
  assetInfo: AppAsset;
}

type TransactionLog = {
  id: number;
  assetId: number;
  amount: number;
  type: string;
  status: string;
  senderWalletId: number;
  receiverWalletId: number | null;
  createdAt: string;
};

interface TransactionLogsResponse {
  logs: TransactionLog[] | [];
  cursor: number | null;
}
