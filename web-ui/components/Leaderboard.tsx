import { useState, useEffect, useMemo } from "react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getLeaderboard, LeaderboardItem } from "../lib/clicker-anchor-client";
import { displayShortPublicKey } from "../lib/utils";

type Props = {
  wallet: AnchorWallet;
  endpoint: string;
  gameAccountPublicKey: string;
  clicks: number;
};

export default function Leaderboard({
  wallet,
  endpoint,
  clicks, // current clicks in active game
}: Props) {
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);

  // retrieve and store expensive leaderboard data (only call when wallet changes)
  useMemo(async () => {
    if (wallet) {
      setLeaders(await getLeaderboard({ wallet, endpoint }));
    }
  }, [wallet, endpoint]);

  useEffect(() => {
    // update current leaderboard with clicks from active game
    setLeaders(
      leaders.map((leader) => {
        if (leader.gameAccountPublicKey === wallet.publicKey.toBase58()) {
          return {
            gameAccountPublicKey: leader.gameAccountPublicKey,
            clicks: clicks,
          };
        }
        return leader;
      })
    );
  }, [clicks]);

  return (
    <div className="sm:p-10 items-center flex flex-col">
      <div className="bg-secondary text-secondary-content rounded p-2 mb-4">
        Leaderboard
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>Total Clicks</th>
            </tr>
          </thead>
          <tbody>
            {leaders.slice(0, 10).map((leader, index) => (
              <tr key={leader.gameAccountPublicKey}>
                <th>{index + 1}</th>
                <td>
                  {leader.gameAccountPublicKey === wallet.publicKey.toBase58()
                    ? "You"
                    : displayShortPublicKey(leader.gameAccountPublicKey)}
                </td>
                <td className="text-center">{leader.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
