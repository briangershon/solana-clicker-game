import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Leaderboard from "../components/Leaderboard";

import { getCurrentGame, saveClick } from "../lib/clicker-anchor-client";

const Home: NextPage = () => {
  const [clicks, setClicks] = useState(0);
  const [effect, setEffect] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
  const [gameError, setGameError] = useState("");
  const [gameAccountPublicKey, setGameAccountPublicKey] = useState("");

  const { connected } = useWallet();
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallet = useAnchorWallet();

  async function handleClick() {
    setGameError("");
    if (wallet) {
      try {
        await saveClick({ wallet, endpoint, gameAccountPublicKey });
        setClicks(clicks + 1);
        setEffect(true);
      } catch (e) {
        if (e instanceof Error) {
          setGameError(e.message);
        }
      }
    }
  }

  useEffect(() => {
    async function initGame() {
      if (wallet) {
        const gameState = await getCurrentGame({ wallet, endpoint });
        setIsGameReady(connected && gameState.isReady);
        setClicks(gameState.clicks);
        setGameAccountPublicKey(gameState.gameAccountPublicKey);
        setSolanaExplorerLink(
          `https://explorer.solana.com/address/${gameAccountPublicKey}/anchor-account?cluster=${network}`
        );
        setGameError(gameState.errorMessage);
      } else {
        setIsGameReady(false);
        setClicks(0);
        setGameAccountPublicKey("");
        setSolanaExplorerLink("");
        setGameError("");
      }
    }
    setIsConnected(connected);
    initGame();
  }, [connected, endpoint, network, wallet, gameAccountPublicKey]);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1">
      <Head>
        <title>Solana Clicker</title>
      </Head>

      <div className="navbar mb-2 bg-base-300 text-base-content rounded-box sm:p-4">
        <div className="flex-1 text-xl font-mono">Solana Clicker</div>
        <div className="flex-none">
          <WalletMultiButton />
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="p-4 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center p-2">
              {isGameReady && (
                <div className="m-2 text-red-500">{gameError}</div>
              )}
              {isGameReady && (
                <div
                  onAnimationEnd={() => {
                    setEffect(false);
                  }}
                  className={`${effect && "animate-wiggle"}`}
                >
                  {clicks} clicks
                </div>
              )}
            </div>
            <button
              disabled={!isGameReady}
              onClick={() => {
                handleClick();
              }}
              className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full"
            >
              Click Me
            </button>

            {isGameReady && (
              <div>
                View game{" "}
                <a
                  className="underline"
                  href={solanaExplorerLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  details
                </a>{" "}
                on Solana.
              </div>
            )}

            {!isConnected && (
              <div>
                <p className="p-2">Please connect your wallet to continue.</p>
                <p className="p-2">
                  Solana wallet support has only been tested on desktop web
                  browsers.
                </p>
              </div>
            )}

            {!isGameReady && isConnected && (
              <div>
                <p className="p-2">Game initializing...</p>
              </div>
            )}
          </div>

          {wallet && (
            <Leaderboard
              wallet={wallet}
              endpoint={endpoint}
              gameAccountPublicKey={gameAccountPublicKey}
              clicks={clicks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
