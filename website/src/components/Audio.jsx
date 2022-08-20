import { useState } from "react";
import ReactHowler from "react-howler";
import sound1 from "../assets/sound1.mp3";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

import { useAccount, useNetwork, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

const AudioPlay = ({ client }) => {
  const [play, setPlay] = useState(false);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner({
    onError(error) {
      console.log("Error", error);
    },
  });

  const createNewFlow = async () => {
    const sf = await Framework.create({
      chainId: chain.id,
      provider: client.provider,
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    console.log(DAIxContract);

    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        flowRate: "10000",
        receiver: "0xF749F9B4de6887AFA6486Ff894d2cA07b6282163",
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
        Sender: "${address}"
        Receiver: "0xF749F9B4de6887AFA6486Ff894d2cA07b6282163",
        FlowRate: 10000
        `
      );
      setPlay(!play);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  };

  const deleteFlow = async (recipient) => {
    const sf = await Framework.create({
      chainId: chain.id,
      provider: client.provider,
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    console.log(DAIx);

    try {
      const deleteFlowOperation = sf.cfaV1.deleteFlow({
        sender: address,
        receiver: "0xF749F9B4de6887AFA6486Ff894d2cA07b6282163",
        superToken: DAIx,
        // userData?: string
      });

      console.log("Deleting your stream...");

      await deleteFlowOperation.exec(signer);

      console.log(
        `Congrats - you've just deleted your money stream!
         Network: Goerli
         Super Token: DAIx
         Sender: "0xF749F9B4de6887AFA6486Ff894d2cA07b6282163"
         Receiver: "${recipient}"
      `
      );
      setPlay(!play);
    } catch (error) {
      console.error(error);
    }
  };

  const PlayOrPauseView = () => {
    if (!play) {
      return (
        <div className="mb-2">
          <ReactHowler src={sound1} playing={play} />
          <AiFillPlayCircle
            className="w-12 h-12"
            onClick={() => createNewFlow()}
          />
        </div>
      );
    } else {
      return (
        <div className="mb-2">
          <ReactHowler src={sound1} playing={play} />
          <AiFillPauseCircle
            className="w-12 h-12"
            onClick={() => deleteFlow()}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className=" flex items-end justify-center bg-no-repeat bg-[url('https://source.unsplash.com/random')] object-contain w-72 h-72">
        <PlayOrPauseView />
      </div>
    </div>
  );
};

export default AudioPlay;
