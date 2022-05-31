import { getByRole, render, screen, within } from "@testing-library/react";
import Leaderboard from "@/components/Leaderboard";
import { LeaderboardItem } from "@/lib/clicker-anchor-client";

describe("Leaderboard", () => {
  it("is hidden if there is no data", () => {
    const el = render(
      <Leaderboard leaders={[]} wallet={{}} endpoint={""} clicks={0} />
    );

    expect(el.container).toBeEmptyDOMElement();
  });

  it("displays one leader with their short public key (if user is not current player)", async () => {
    const leader: LeaderboardItem = {
      playerPublicKey: "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
      clicks: 50,
    };
    const el = render(
      <Leaderboard leaders={[leader]} walletPublicKeyString={""} clicks={0} />
    );

    const values = [["1", "0xabcd..effg", 50]];

    values.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(1).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(2); // tbody tr + one leader
  });

  it("displays one leader with 'You' instead of their short public key (if user is current player)", async () => {
    const leader: LeaderboardItem = {
      playerPublicKey: "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
      clicks: 50,
    };
    const el = render(
      <Leaderboard leaders={[leader]} walletPublicKeyString={"abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"} clicks={60} />
    );

    const values = [["1", "You", 60]];

    values.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(1).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(2); // tbody tr + one leader
  });

  it.todo("should show multiple rows and be sorted");
  it.todo("should only show top 10");

  it.todo("should say 'You' if playerPublicKey matches current wallet PublicKey");

  describe("when current users clicks", () => {
    it("and they are in leaderboard, should show new value of clicks", async () => {
      const leader: LeaderboardItem = {
        playerPublicKey: "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 50,
      };
      const el = render(
        <Leaderboard leaders={[leader]} walletPublicKeyString={"abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"} clicks={60} />
      );
  
      const values = [["1", "You", 60]];
  
      values.forEach(([rank, shortPublicKey, clicks]) => {
        const row = screen.getByText(1).closest("tr");
        if (!row) throw new Error("row not found");
        const utils = within(row);
        expect(utils.getByText(rank)).toBeInTheDocument();
        expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
        expect(utils.getByText(clicks)).toBeInTheDocument();
      });
  
      // how many rows are we expecting
      const items = await screen.findAllByRole("row");
      expect(items).toHaveLength(2); // tbody tr + one leader
    });

    it.todo(
      "and they are in leaderboard, and clicks moved them up, should show player in new position"
    );
    it.todo(
      "and they not in leaderboard since it is first game, should show up if they are in top 10"
    );
  });
});
