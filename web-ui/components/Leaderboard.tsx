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
    let foundCurrentUser = false;
    const updatedLeaders = leaders.map((leader) => {
      if (leader.playerPublicKey === walletPublicKeyString) {
        foundCurrentUser = true;
        return {
          playerPublicKey: leader.playerPublicKey,
          clicks: clicks,
        };
      }
      return leader;
    });

    // if users first game (and they aren't in list of games retrieved) add 'em
    if (walletPublicKeyString && clicks && !foundCurrentUser) {
      updatedLeaders.push({
        playerPublicKey: walletPublicKeyString,
        clicks: clicks,
      });
    }

    // sort by leader
    const sortByClicks = updatedLeaders.sort((a, b) => b.clicks - a.clicks);
    setDisplayLeaders(sortByClicks);
  }, [clicks, walletPublicKeyString, leaders]);

  if (!displayLeaders.length) {
    return null;
  }

  return (
    <div className="sm:p-10 items-center flex flex-col">
      <div className="text-2xl mb-4">Leaderboard</div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-center">Rank</th>
              <th className="text-center">Player</th>
              <th className="text-center">Total Clicks</th>
            </tr>
          </thead>
          <tbody>
            {displayLeaders.slice(0, 10).map((leader, index) => (
              <tr key={leader.playerPublicKey}>
                <th className="text-center">{index + 1}</th>
                <td className="text-center">
                  {leader.playerPublicKey === walletPublicKeyString ? (
                    <b>You</b>
                  ) : (
                    displayShortPublicKey(leader.playerPublicKey)
                  )}
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
