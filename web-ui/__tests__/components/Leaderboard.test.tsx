import { getByRole, render, screen, within } from "@testing-library/react";
import Leaderboard from "@/components/Leaderboard";
import { LeaderboardItem } from "@/lib/clicker-anchor-client";

describe("Leaderboard", () => {
  it("is hidden if there is no data", () => {
    const el = render(
      <Leaderboard leaders={[]} walletPublicKeyString={""} clicks={0} />
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
      const row = screen.getByText(shortPublicKey).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting?
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(2); // tbody tr + one leader
  });

  it("displays one leader with 'You' instead of their short public key (if user is current player)", async () => {
    const leader: LeaderboardItem = {
      playerPublicKey: "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
      clicks: 50,
    };
    const el = render(
      <Leaderboard
        leaders={[leader]}
        walletPublicKeyString={"abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"}
        clicks={60}
      />
    );

    const values = [["1", "You", 60]];

    values.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(shortPublicKey).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting?
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(2); // tbody tr + one leader
  });

  it("should show multiple rows and be sorted", async () => {
    const leaders: LeaderboardItem[] = [
      {
        playerPublicKey: "3bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "1bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 50,
      },
      {
        playerPublicKey: "2bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 20,
      },
    ];
    const el = render(
      <Leaderboard leaders={leaders} walletPublicKeyString={""} clicks={0} />
    );

    const values = [
      ["1", "0x1bcd..effg", 50],
      ["2", "0x2bcd..effg", 20],
      ["3", "0x3bcd..effg", 5],
    ];

    values.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(shortPublicKey).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting?
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(1 + 3); // tbody tr + 3 leaders
  });

  it("should show maximum of 10 entries", async () => {
    const leaders: LeaderboardItem[] = [
      {
        playerPublicKey: "3bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "1bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 50,
      },
      {
        playerPublicKey: "2bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 20,
      },
      {
        playerPublicKey: "4bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "5bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "6bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "7bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "8bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "9bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "10cdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
      {
        playerPublicKey: "11cdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 5,
      },
    ];
    const el = render(
      <Leaderboard leaders={leaders} walletPublicKeyString={""} clicks={0} />
    );

    // how many rows are we expecting?
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(1 + 10); // tbody tr + 3 leaders
  });

  describe("when current users clicks", () => {
    it("and they are in leaderboard, should show new value of clicks", async () => {
      const leader: LeaderboardItem = {
        playerPublicKey: "abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 50,
      };
      const el = render(
        <Leaderboard
          leaders={[leader]}
          walletPublicKeyString={"abcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"}
          clicks={60}
        />
      );

      const values = [["1", "You", 60]];

      values.forEach(([rank, shortPublicKey, clicks]) => {
        const row = screen.getByText(shortPublicKey).closest("tr");
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

    it("and they are in leaderboard, and clicks moved them up, should show player in new position", async () => {
      const leaders: LeaderboardItem[] = [
        {
          playerPublicKey: "3bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
          clicks: 5,
        },
        {
          playerPublicKey: "1bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
          clicks: 50,
        },
        {
          playerPublicKey: "2bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
          clicks: 20,
        },
      ];
      const el = render(
        <Leaderboard
          leaders={leaders}
          walletPublicKeyString={"3bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"}
          clicks={25}
        />
      );

      const values = [
        ["1", "0x1bcd..effg", 50],
        ["2", "You", 25],
        ["3", "0x2bcd..effg", 20],
      ];

      values.forEach(([rank, shortPublicKey, clicks]) => {
        const row = screen.getByText(shortPublicKey).closest("tr");
        if (!row) throw new Error("row not found");
        const utils = within(row);
        expect(utils.getByText(rank)).toBeInTheDocument();
        expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
        expect(utils.getByText(clicks)).toBeInTheDocument();
      });

      // how many rows are we expecting?
      const items = await screen.findAllByRole("row");
      expect(items).toHaveLength(1 + 3); // tbody tr + 3 leaders
    });
    it("and they not in leaderboard since it is first game, should show up if they are in top 10", async () => {
      const leaders: LeaderboardItem[] = [
        {
          playerPublicKey: "1bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
          clicks: 50,
        },
        {
          playerPublicKey: "2bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
          clicks: 20,
        },
      ];
      const el = render(
        <Leaderboard
          leaders={leaders}
          walletPublicKeyString={"3bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg"}
          clicks={1}
        />
      );

      const values = [
        ["1", "0x1bcd..effg", 50],
        ["2", "0x2bcd..effg", 20],
        ["3", "You", 1],
      ];

      values.forEach(([rank, shortPublicKey, clicks]) => {
        const row = screen.getByText(shortPublicKey).closest("tr");
        if (!row) throw new Error("row not found");
        const utils = within(row);
        expect(utils.getByText(rank)).toBeInTheDocument();
        expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
        expect(utils.getByText(clicks)).toBeInTheDocument();
      });

      // how many rows are we expecting?
      const items = await screen.findAllByRole("row");
      expect(items).toHaveLength(1 + 3); // tbody tr + 3 leaders
    });
  });

  it('if "leaders" prop changes, component should re-render with new data (to ensure useEffect has `leaders` dependency)', async () => {
    // this bug prevents the leaderboard from rendering, so adding test to ensure this doesn't crop up
    const leaders: LeaderboardItem[] = [
      {
        playerPublicKey: "1bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 50,
      },
    ];

    const { rerender } = render(
      <Leaderboard leaders={leaders} walletPublicKeyString={""} clicks={1} />
    );
    const values = [["1", "0x1bcd..effg", 50]];

    values.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(shortPublicKey).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting
    const items = await screen.findAllByRole("row");
    expect(items).toHaveLength(2); // tbody tr + one leader

    //
    // re-render the same component with different props
    //

    const leaders2: LeaderboardItem[] = [
      {
        playerPublicKey: "2bcdefabcdefabcdefabcdefabcdefabcdefabcdeffg",
        clicks: 20,
      },
    ];

    rerender(
      <Leaderboard leaders={leaders2} walletPublicKeyString={""} clicks={1} />
    );

    const values2 = [["1", "0x2bcd..effg", 20]];

    values2.forEach(([rank, shortPublicKey, clicks]) => {
      const row = screen.getByText(shortPublicKey).closest("tr");
      if (!row) throw new Error("row not found");
      const utils = within(row);
      expect(utils.getByText(rank)).toBeInTheDocument();
      expect(utils.getByText(shortPublicKey)).toBeInTheDocument();
      expect(utils.getByText(clicks)).toBeInTheDocument();
    });

    // how many rows are we expecting
    const items2 = await screen.findAllByRole("row");
    expect(items2).toHaveLength(2); // tbody tr + one leader
  });
});
