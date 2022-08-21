import React, { useState, useMemo } from "react";
import { Web3Storage } from "web3.storage";
import useIpfs from "../hooks/useIpfs";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "../graphql/createPublication";
import { GET_PROFILES } from "../graphql/getProfiles";
import { useAccount } from "wagmi";
import { splitSignature, signedTypeData } from "../utils/ethersService";
import { lensHub } from "../utils/lensHub";

function PublishSong(props) {
  const [files, setFiles] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const { ipfs } = useIpfs();
  const [profile, setProfile] = useState();
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
      typedData.dodiv,
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
    <div class="flex items-center justify-center  font-sans flex-col">
      <p className="font-semibold text-xl mb-12">Publish new song</p>
      <label
        for="dropzone-file"
        class="mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h2 class="mt-4 text-xl font-medium text-gray-700 tracking-wide">
          Music File
        </h2>
        <p class="mt-2 text-gray-500 tracking-wide">
          Upload or darg & drop your file MP3, WAV, ETC...
        </p>
        <input
          type="file"
          id="dropzone-file"
          className="hidden"
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
        />{" "}
      </label>
      {file && (
        <button
          className="p-2 bg-zinc-800 text-white rounded-xl mt-2"
          onClick={createPublication}
        >
          Publish Publication
        </button>
      )}
    </div>
  );
}

export default PublishSong;
