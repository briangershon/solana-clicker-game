import { useEffect, useState } from "react";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState, Adapter } from "@solana/wallet-adapter-base";

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
  const [installedWallets, setInstalledWallets] = useState<Adapter[]>([]);

  const { disconnect, connected, wallet, wallets } = useWallet();

  useEffect(() => {
    setIsConnected(connected);
    setPk(shortenPublicKey(wallet));

    const installed = wallets
      .filter((w) => w.adapter.readyState == WalletReadyState.Installed)
      .map((w) => {
        return w.adapter;
      });
    setInstalledWallets(installed);
  }, [connected, wallet, wallets]);

  return (
    <div className="dropdown dropdown-left">
      <label tabIndex={0} className="btn m-1">
        {pk ? `Connected: ${pk}` : "Connect Wallet"}
      </label>

      <div
        tabIndex={0}
        className="dropdown-content card card-compact p-2 shadow bg-primary text-primary-content w-56"
      >
        <div className="card-body">
          <h3 className="card-title">
            {isConnected ? `Connected to ${pk}` : "Not connected"}
          </h3>

          {installedWallets.map((adapter) => {
            return (
              <button
                key={adapter.name}
                disabled={isConnected}
                className="btn btn-secondary"
                onClick={async () => {
                  await adapter.connect();
                  setIsConnected(adapter.connected);
                  if (adapter.publicKey != null) {
                    setPk(
                      `${adapter.publicKey
                        .toBase58()
                        .substring(0, 4)}..${adapter.publicKey
                        .toBase58()
                        .slice(-4)}`
                    );
                  }
                  onUseWalletClick();
                }}
              >
                Connect {adapter.name}
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
              // e.currentTarget.blur();
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};
