import React, { useState, useMemo } from "react";
import { Web3Storage } from "web3.storage";
import useIpfs from "../hooks/useIpfs";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "../graphql/createPublication";
import { GET_PROFILES } from "../graphql/getProfiles";
import { useAccount } from "wagmi";
import { splitSignature, signedTypeData } from "../utils/ethersService";
import { lensHub } from "../utils/lensHub";
import ReactHowler from "react-howler";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";

function PublishSong(props) {
  const [files, setFiles] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const { ipfs } = useIpfs();
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState();

  const { address } = useAccount();

  const { data } = useQuery(GET_PROFILES, {
    onCompleted: (data) => {
      console.log(data);
      setProfile(data.profiles.items[0]);
      console.log(profile);
    },
    variables: {
      request: {
        ownedBy: [address],
      },
    },
  });

  const [createPostTypedData] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: { request: {} },
  });

  const createPublication = async () => {
    // Upload to web3.storage (filecoin)
    // User can use his own key soon
    const testToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFDYjNDRDM4RTRFQTVmMEFhNWQwOWM2RTQ1YUYwOGMzRkY2NUYzY0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEwMzAzNTkzNzYsIm5hbWUiOiJ0ZXN0SVBGUyJ9.HGBuR9-HTY4UX4EB3Imzdocz2JrYURnAYxffiizfXkE";
    const client = new Web3Storage({ token: testToken });
    const rootCid = await client.put(files, {
      name: `Test-${new Date().getTime().toString()}`,
      maxRetries: 3,
    });

    console.log(rootCid);
    //console.log(await ipfs.pin.add(rootCid));
    const createPostTypedDataRequest = {
      profileId: profile.id,
      contentURI: `ipfs://${rootCid}`,
      collectModule: {
        freeCollectModule: {
          followerOnly: true,
        },
      },
      referenceModule: {
        followerOnlyReferenceModule: false,
      },
    };

    const typedDataRequest = await createPostTypedData({
      variables: { request: createPostTypedDataRequest },
    });
    const typedData = typedDataRequest.data.createPostTypedData.typedData;
    console.log(typedData);
    const signature = await signedTypeData(
      typedData.domain,
      typedData.types,
      typedData.value
    );
    const { v, r, s } = await splitSignature(signature);
    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log(tx);

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-2xl font-semibold mb-12 mt-6">Upload a new Song</p>
      <input
        type="file"
        className="mb-12"
        onChange={(event) => {
          const fileList = event.target.files;
          setFiles(fileList);
          for (let i = 0; i < fileList.length; i += 1) {
            const newFile = fileList[i];
            const reader = new FileReader();
            reader.addEventListener("load", (e) => {
              console.log(e.target.result);
              console.log(ipfs);
              setFile(e.target.result);
            });
            reader.readAsArrayBuffer(newFile);
            console.log(file);
          }
        }}
      />

      <button
        className="p-2 bg-zinc-800 disabled:bg-zinc-500 text-white rounded-lg ml-1"
        disabled={!file}
        onClick={createPublication}
      >
        Upload to IPFS
      </button>
      {publications && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {publications.explorePublications.items.map((publication, i) => (
            <div className="flex flex-col items-center justify-between w-72 h-72 bg-gradient-to-r from-indigo-500">
              <h4 className="m-5 text-center">{publication.metadata.name}</h4>
              <ReactHowler
                src={publication.metadata.media[0].original.url}
                playing={false}
              />
              <AiFillPlayCircle className="text-white mb-2 w-12 h-12" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublishSong;
