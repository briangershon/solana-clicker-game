import axios from "axios";
import {
  createConnectionConfig,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

import { WalletAndNetwork, NFT, ClickerNFT } from "@/types/index";

async function getNFTs({
  wallet,
  endpoint,
}: WalletAndNetwork): Promise<ClickerNFT[]> {
  const publicAddress = wallet.publicKey.toBase58();

  try {
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
      connection: createConnectionConfig(endpoint, "processed"),
    });

    const clickerNfts: ClickerNFT[] = [];
    for (let i = 0; i < nftArray.length; i++) {
      clickerNfts.push(await fetchNFTMetadata(nftArray[i]));
    }

    return clickerNfts;
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error thrown, while fetching NFTs", e.message);
    }
  }
  return [];
}

async function fetchNFTMetadata(nft: NFT): Promise<ClickerNFT> {
  const uri = nft.data.uri;
  const metadata = await axios({
    url: uri,
    method: "get",
  });
  return {
    name: metadata.data.name,
    imageUrl: metadata.data.image,
  };
}

export { getNFTs, fetchNFTMetadata };
