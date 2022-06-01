import { PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export type WalletAndNetwork = {
  wallet: AnchorWallet;
  endpoint: string;
};

// Type of object coming back from `program.account.game.all()` call
export type ClickerGameObject = {
  publicKey: PublicKey; // game's key
  account: {
    player: PublicKey; // player's key
    clicks: number; // total clicks
  };
};

export type WalletAndGamePublicKey = {
  wallet: AnchorWallet;
  endpoint: string;
  gameAccountPublicKey: string;
};

export type GameState = {
  clicks: number;
  gameAccountPublicKey: string;
  isReady: boolean;
  errorMessage: string;
};

export type LeaderboardItem = {
  playerPublicKey: string;
  clicks: number;
};

export type NFT = {
  data: {
    name: string;
    uri: string;
  };
};

export type ClickerNFT = {
  name: string;
  imageUrl: string;
};
