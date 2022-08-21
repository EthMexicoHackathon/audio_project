import { useQuery, gql } from "@apollo/client";
import { EXPLORE_AUDIO_PUBLICATIONS } from "../graphql/explorePublications";
import React, { useState } from "react";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import ReactHowler from "react-howler";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

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

  const createNewFlow = async (receiver, i) => {
    console.log(receiver);

    const sf = await Framework.create({
      chainId: chain.id,
      provider: client.provider,
    });

    const DAIxContract = await sf.loadSuperToken("MATICx");
    const DAIx = DAIxContract.address;

    console.log(DAIxContract);

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: "10000",
        receiver: receiver,
        superToken: DAIx,
        // userData?: string
      });

      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(signer);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
        View Your Stream At: https://app.superfluid.finance/dashboard/0xF749F9B4de6887AFA6486Ff894d2cA07b6282163
        Network: Goerli
        Super Token: DAIx
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

    const DAIxContract = await sf.loadSuperToken("MATICx");
    const DAIx = DAIxContract.address;

    console.log(DAIx);

    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: address,
        receiver: recipent,
        superToken: DAIx,
        // userData?: string
      });

      console.log("Deleting your stream...");

      await deleteFlowOperation.exec(signer);

      console.log(
        `Congrats - you've just deleted your money stream!
         Network: Goerli
         Super Token: DAIx
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data.explorePublications.items.map((publication, i) => (
        <div className="flex flex-col items-center justify-between w-72 h-72 bg-gradient-to-r from-indigo-500">
          <h4 className="m-5 text-center">{publication.metadata.name}</h4>
          <ReactHowler
            src={publication.metadata.media[0].original.url}
            playing={play}
          />
          {openedItem === i ? (
            <AiFillPauseCircle
              className="text-white mb-2 w-12 h-12"
              onClick={() => {
                deleteFlow(publication.profile.ownedBy);
              }}
            />
          ) : (
            <AiFillPlayCircle
              className="text-white mb-2 w-12 h-12"
              onClick={() => {
                createNewFlow(publication.profile.ownedBy, i);
              }}
            />
          )}
        </div>
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
