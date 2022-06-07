import { render, screen } from "@testing-library/react";
import { ClickerNFT } from "@/types/index";
import { NFTWallet } from "@/components/NFTWallet";

describe("NFTWallet", () => {
  it("renders NFTs", () => {
    const nfts: ClickerNFT[] = [
      {
        name: "NFT One",
        imageUrl: "https://image",
      },
      {
        name: "NFT Two",
        imageUrl: "https://image2",
      },
    ];
    render(<NFTWallet nfts={nfts} />);

    const values = [
      ["NFT One", "https://image"],
      ["NFT Two", "https://image2"],
    ];

    values.forEach(([name, url]) => {
      const img = screen.getByAltText(name);
      expect(img).toHaveAttribute("src", url);
    });
  });
});
