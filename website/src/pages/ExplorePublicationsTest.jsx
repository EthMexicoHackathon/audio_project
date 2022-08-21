import { useQuery, gql } from "@apollo/client";
import { EXPLORE_AUDIO_PUBLICATIONS } from "../graphql/explorePublications";
import React, { useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import ReactHowler from "react-howler";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { maticxABI } from "../config";
import { ethers } from "ethers";

export default function ExplorePublicationsTest({ client }) {
  const [play, setPlay] = useState(false);
  const [openedItem, setOpenedItem] = useState(null);

  const { data, loading, error } = useQuery(EXPLORE_AUDIO_PUBLICATIONS, {
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });

  const getSomeFakeMoney = async (amt) => {
    // matic testnet
    const Maticx_address = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4";

    const MATICx = new ethers.Contract(
      Maticx_address,
      maticxABI,
      client.provider
    );

    try {
      console.log(`upgrading ${amt} ETH to ETHx`);

      const amtToUpgrade = ethers.utils.parseEther(amt.toString());
      const reciept = await MATICx.connect(signer).upgradeByETH({
        value: amtToUpgrade,
      });
      await reciept.wait().then(function (tx) {
        console.log(
          `
          Congrats - you've just upgraded Matic to Maticx!
        `
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  const createNewFlow = async (receiver, i) => {
    console.log(receiver);

    const sf = await Framework.create({
      chainId: chain.id,
      provider: client.provider,
    });

    const MaticxContract = await sf.loadSuperToken("MATICx");
    const Maticx = MaticxContract.address;

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: "10000",
        receiver: receiver,
        superToken: Maticx,
        // userData?: string
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(signer);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/0xF749F9B4de6887AFA6486Ff894d2cA07b6282163
        Network: Goerli
        Super Token: Maticx
        Sender: ${address}
        Receiver: ${receiver}
        FlowRate: 10000
        `
      );
      setOpenedItem(i);
      setPlay(!play);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };

  const deleteFlow = async (recipent) => {
    const sf = await Framework.create({
      chainId: chain.id,
      provider: client.provider,
    });

    const MaticxContract = await sf.loadSuperToken("MATICx");
    const Maticx = MaticxContract.address;

    console.log(Maticx);

    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: address,
        receiver: recipent,
        superToken: Maticx,
        // userData?: string
      });

      console.log("Deleting your stream...");

      await deleteFlowOperation.exec(signer);

      console.log(
        `Congrats - you've just deleted your money stream!
         Network: Goerli
         Super Token: Maticx
         Sender: ${recipent}
         Receiver: ${address}
      `
      );
      setPlay(!play);
      setOpenedItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  return data ? (
    <div className="md:mx-20 grid sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {data.explorePublications.items.map((publication, i) => (
        <div className="flex flex-col items-center justify-between w-56 h-56 lg:w-72 lg:h-72 bg-gradient-to-t from-indigo-500  to-blue-500  rounded-lg mt-5">
          <h4 className="m-5 text-center text-white">
            {publication.metadata.name}
          </h4>
          <ReactHowler
            src={publication.metadata.media[0].original.url}
            playing={play}
          />
          {openedItem === i ? (
            <AiFillPauseCircle
              className="text-white mb-2 w-12 h-12 cursor-pointer"
              onClick={() => {
                deleteFlow(publication.profile.ownedBy);
              }}
            />
          ) : (
            <AiFillPlayCircle
              className="text-white mb-2 w-12 h-12 cursor-pointer"
              onClick={() => {
                createNewFlow(publication.profile.ownedBy, i);
              }}
            />
          )}
        </div>
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center">Loading...</div>
  );
}
