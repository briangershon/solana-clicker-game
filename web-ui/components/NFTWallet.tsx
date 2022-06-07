import { ClickerNFT } from "@/types/index";

type Props = {
  nfts: ClickerNFT[];
};

function NFTWallet(props: Props) {
  const { nfts } = props;

  return (
    <>
      <div className="text-2xl mb-4">Your Auto-clickers (NFTs)</div>
      <div className="flex flex-wrap">
        {nfts.map((nft) => {
          return (
            <div
              key={nft.imageUrl}
              className="card w-32 bg-base-100 shadow-xl m-5"
            >
              <figure>
                <img src={nft.imageUrl} alt={nft.name} />
              </figure>
              <div className="card-body bg-neutral p-2">
                <h2 className="card-title text-sm">{nft.name}</h2>
                {/* <p className="text-xs">If a dog chews shoes whose shoes does he choose?</p> */}
                {/* <div className="card-actions justify-end">
                  <button className="btn btn-primary">Buy Now</button>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export { NFTWallet };
