import { useState, useEffect, useRef } from "react";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getLeaderboard, LeaderboardItem } from "../lib/clicker-anchor-client";
import { displayShortPublicKey } from "../lib/utils";

type Props = {
  wallet: AnchorWallet;
  endpoint: string;
  clicks: number;
};

export default function Leaderboard({
  wallet,
  endpoint,
  clicks, // current clicks in active game
}: Props) {
  const [leaders, setLeaders] = useState<LeaderboardItem[]>([]);
  const worldGameData = useRef<LeaderboardItem[]>([]);

  // persist expensive "retrieve all game data" call in a Ref
  useEffect(() => {
    (async function getLeaderboardData() {
      if (wallet) {
        worldGameData.current = await getLeaderboard({ wallet, endpoint });
        setLeaders(worldGameData.current);
      }
    })();
  }, [wallet, endpoint]);

  // update existing leaderboard data with clicks from active game
  // without reloading from Solana
  useEffect(() => {
    worldGameData.current.forEach((game) => {
      if (game.playerPublicKey === wallet.publicKey.toBase58()) {
        game.clicks = clicks;
      }
    });
  }, [clicks, wallet.publicKey]);

  if (!leaders.length) {
    return null;
  }

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
              <tr key={leader.playerPublicKey}>
                <th>{index + 1}</th>
                <td>
                  {leader.playerPublicKey === wallet.publicKey.toBase58()
                    ? "You"
                    : displayShortPublicKey(leader.playerPublicKey)}
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
