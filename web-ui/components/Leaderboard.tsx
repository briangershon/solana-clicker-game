import { useState, useEffect, useRef } from "react";
import { LeaderboardItem } from "@/lib/clicker-anchor-client";
import { displayShortPublicKey } from "@/lib/utils";

type Props = {
  leaders: LeaderboardItem[];
  walletPublicKeyString: string;
  clicks: number;
};

export default function Leaderboard({
  leaders, // all games retrieved from Solana
  walletPublicKeyString, // current player
  clicks, // current player's clicks
}: Props) {
  const [displayLeaders, setDisplayLeaders] = useState<LeaderboardItem[]>([]);

  // update existing leaderboard data with clicks from active game
  // without reloading from Solana
  useEffect(() => {
    setDisplayLeaders(
      leaders.map((leader) => {
        if (leader.playerPublicKey === walletPublicKeyString) {
          return {
            playerPublicKey: leader.playerPublicKey,
            clicks: clicks,
          };
        }
        return leader;
      })
    );
  }, [clicks, walletPublicKeyString]);

  if (!displayLeaders.length) {
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
            {displayLeaders.slice(0, 10).map((leader, index) => (
              <tr key={leader.playerPublicKey}>
                <th>{index + 1}</th>
                <td>
                  {leader.playerPublicKey === walletPublicKeyString
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
