import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="flex items-center flex-col">
      <Head>
        <title>Home</title>
      </Head>
      <h1 className="text-3xl font-bold">Welcome</h1>
    </div>
  );
};

export default Home;
