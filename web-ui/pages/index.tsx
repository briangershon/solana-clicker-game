import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col">
      <Head>
        <title>Solana Clicker</title>
      </Head>

      <div className="flex flex-col sm:flex-row">
        <div className="p-10 flex flex-col items-center justify-between">
          <h2 className="text-xl font-bold">Solana Clicker</h2>
          <div className="flex flex-col items-center p-2">
            <div>0 clicks</div>
            <div>0 cps</div>
          </div>
          <button className="bg-blue-500 p-2 h-48 w-48 rounded-full">
            Click Me
          </button>
        </div>

        <div className="sm:p-10 items-center flex flex-col justify-between">
          <h2 className="text-xl font-bold">Extras</h2>
          <div className="bg-orange-300 m-3 border-0 p-2 shadow-md w-48">
            auto-clicker one
          </div>
          <div className="bg-pink-300 m-3 border-0 p-2 shadow-md w-48">
            auto-clicker two
          </div>
          <div className="bg-green-300 m-3 border-0 p-2 shadow-md w-48">
            auto-clicker three
          </div>
        </div>
      </div>
      <div className="p-2 m-3 flex">
        <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus one</div>
        <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus two</div>
        <div className="bg-blue-300 m-3 w-28 h-16 shadow p-2">bonus three</div>
      </div>
    </div>
  );
};

export default Home;
