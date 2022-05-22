import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

type Props = {
  onUseWalletClick: () => void;
};

function shortenPublicKey(wallet: Wallet | null): string {
  if (wallet?.adapter.publicKey) {
    const pk = wallet.adapter.publicKey;
    return `${pk.toBase58().substring(0, 4)}..${pk.toBase58().slice(-4)}`;
  }
  return "";
}

export const WalletMenu = ({ onUseWalletClick }: Props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [pk, setPk] = useState("");
  const [installedWallets, setInstalledWallets] = useState<Wallet[]>([]);

  const { disconnect, connected, wallet, wallets } = useWallet();

  useEffect(() => {
    setIsConnected(connected);
    setPk(shortenPublicKey(wallet));

    const installed = wallets
      .filter((w) => w.adapter.readyState == WalletReadyState.Installed)
      .map((w) => {
        return w;
      });
    setInstalledWallets(installed);
  }, [connected, wallet, wallets]);

  return (
    <div>
      <label htmlFor="wallet-modal" className="btn modal-button">
        {pk ? `Connected: ${pk}` : "Connect Wallet"}
      </label>

      <input type="checkbox" id="wallet-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {isConnected ? `Connected to ${pk}` : "Not connected"}
          </h3>

          {installedWallets.length === 0 && (
            <div>
              <p className="py-4">
                No Solana wallets found. Please visit the{" "}
                <a
                  className="underline"
                  href="https://docs.solana.com/wallet-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  Solana Wallet Guide
                </a>
                .
              </p>{" "}
              <p className="py-4">
                This app supports{" "}
                {wallets.map((w) => w.adapter.name).join(", ")} wallets.
              </p>
            </div>
          )}

          <div className="flex flex-col">
            {installedWallets.map((wallet) => {
              return (
                <button
                  key={wallet.adapter.name}
                  disabled={isConnected}
                  className="btn btn-primary"
                  onClick={async () => {
                    await wallet.adapter.connect();
                    setIsConnected(wallet.adapter.connected);
                    if (wallet.adapter.publicKey != null) {
                      setPk(shortenPublicKey(wallet));
                    }
                    onUseWalletClick();
                  }}
                >
                  Connect {wallet.adapter.name}
                </button>
              );
            })}

            <button
              disabled={!isConnected}
              className="btn btn-secondary"
              onClick={async () => {
                await disconnect();
                setIsConnected(false);
                setPk("");
              }}
            >
              Disconnect
            </button>
          </div>
          <div className="modal-action">
            <label htmlFor="wallet-modal" className="btn">
              Ok
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
