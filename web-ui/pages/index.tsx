import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";

import { useWallet } from "@solana/wallet-adapter-react";

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const Home: NextPage = () => {
  const [clicks, setClicks] = useState(0);
  const [effect, setEffect] = useState(false);

  function handleClick() {
    setClicks(clicks + 1);
  }

  const [isConnected, setIsConnected] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setIsConnected(connected);
  }, [connected]);

  return (
    <div className="flex items-center flex-col sm:p-4 p-1">
      <Head>
        <title>Solana Clicker</title>
      </Head>

      <div className="navbar mb-2 bg-base-300 text-base-content rounded-box sm:p-4">
        <div className="flex-1 text-xl font-mono">Solana Clicker</div>
        <div className="flex-none">
          <WalletMultiButton />
          <WalletDisconnectButton />
        </div>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row">
          <div className="p-4 flex flex-col items-center justify-between gap-3">
            <div className="flex flex-col items-center p-2">
              {isConnected && (
                <div
                  onAnimationEnd={() => {
                    setEffect(false);
                  }}
                  className={`${effect && "animate-wiggle"}`}
                >
                  {clicks} clicks
                </div>
              )}
              {/* <div>0 cps</div> */}
            </div>
            <button
              disabled={!isConnected}
              onClick={() => {
                handleClick();
                setEffect(true);
              }}
              className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full"
            >
              Click Me
            </button>

            {!isConnected && <div>Please connect your wallet to continue.</div>}
          </div>

          {/* <div className="sm:p-10 items-center flex flex-col justify-between">
        <h2 className="text-xl font-bold">Extras</h2>
        <div className="bg-orange-300 m-3 border-0 p-2 shadow-md w-48">
          auto-clicker one
        </div>
        <div className="bg-pink-300 m-3 border-0 p-2 shadow-md w-48">
          auto-clicker two
        </div>
        <div className="bg-green-300 m-3 border-0 p-2 shadow-md w-48">
          auto-clicker three
        </div>
      </div> */}
        </div>
        {/* <div className="p-2 m-3 flex">
      <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus one</div>
      <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus two</div>
      <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus three</div>
    </div> */}
      </div>
    </div>
  );
};

export default Home;
