import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useMemo } from "react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Leaderboard from "@/components/Leaderboard";

import { getCurrentGame, saveClick } from "@/lib/clicker-anchor-client";

import FAQItem from "@/components/FaqItem";
import ExternalLink from "@/components/ExternalLink";

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
              <p className="p-2 text-center">
                To play game, please click{" "}
                <span className="font-bold">Select Wallet</span> above to choose
                your Solana wallet.
                <br />
                <br />
                See FAQs below for more information.
              </p>
            )}

            {!isGameReady && isConnected && (
              <div>
                <p className="p-2">Game initializing...</p>
              </div>
            )}
          </div>

          {wallet && (
            <Leaderboard wallet={wallet} endpoint={endpoint} clicks={clicks} />
          )}
        </div>
      </div>

      <footer className="w-full mt-24 p-3 sm:w-3/4 text-xs">
        <div className="text-2xl text-center">FAQs</div>

        <FAQItem faq="Which web browsers are supported?">
          <>
            This game should run on any browser that support Web3 and a Solana
            wallet. Officially tested on desktop Firefox and desktop Chrome.
          </>
        </FAQItem>

        <FAQItem faq="What are the rules of this game?">
          <>
            <p>The goal is to be the player with the most clicks.</p>

            <p className="mt-3">
              Today players can only acquire clicks manually. The future plan is
              to grow this into a full-fledged Clicker game where players earn
              auto-clickers by purchasing NFTs. Each NFT will automatically
              increase a player&apos;s points automatically.
            </p>
          </>
        </FAQItem>
        <FAQItem faq="How do I select a wallet and play the game?">
          <>
            <p>
              This game runs in a desktop web-browser which connects directly
              with the Solana blockchain. The blockchain is like a public
              database that&apos;s keeping track of your score.
            </p>
            <p className="mt-3">
              To connect to a blockchain, you need a wallet. Phantom is a Solana
              wallet that installs on your browser, though there are many
              choices. Visit{" "}
              <ExternalLink
                href="https://docs.solana.com/wallet-guide"
                text="Solana Wallet Guide"
              />{" "}
              for more help. We support Phantom, Solflare, Torus, Glow and
              Slope. Let us know if your favorite wallet is not on the list.
            </p>
            <p className="mt-3">
              Once you have a wallet, and you&apos;ve created your account, you
              can now choose <span className="font-bold">select wallet</span> to
              connect and play.
            </p>
          </>
        </FAQItem>
        <FAQItem faq="What is Solana?">
          <>
            &quot;Solana is a decentralized blockchain built to enable scalable,
            user-friendly apps for the world.&quot; (from{" "}
            <ExternalLink href="https://solana.com/" text="solana.com" />)
          </>
        </FAQItem>
        <FAQItem faq="How can I contribute to this open-source project?">
          <p>
            You can contribute in the form of feedback, marketing, design,
            feature development, fixing bugs, or writing documentation. Please
            visit our{" "}
            <ExternalLink
              href="https://github.com/briangershon/solana-clicker-game/issues"
              text="issues board"
            />{" "}
            or{" "}
            <ExternalLink
              href="https://github.com/briangershon/solana-clicker-game/milestones"
              text="milestones"
            />
            .
          </p>
        </FAQItem>
        <FAQItem faq="How do I build my own application like this on Solana?">
          <p>
            This project is open-source and provides working examples of code
            for building web apps that run on the Solana blockchain. Learn more
            at{" "}
            <ExternalLink
              href="https://github.com/briangershon/solana-clicker-game"
              text="github.com/briangershon/solana-clicker-game"
            />
            .
          </p>
        </FAQItem>
      </footer>
    </div>
  );
};

export default Home;
