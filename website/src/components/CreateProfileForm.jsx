import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { GET_PROFILES } from "../graphql/getProfiles";
import { useAccount } from "wagmi";

const CREATE_PROFILE = gql`
  mutation ($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`;

function CreateProfileForm() {
  const [handle, setHandle] = useState("");
  const { address } = useAccount();

  const [createProfile, { loading }] = useMutation(CREATE_PROFILE, {
    onCompleted: (data) => {
      console.log(data);
      if (data?.createaProfile?.__typename === "RelayError") {
        alert("Error creating profile: " + data?.createProfile?.reason);
      } else {
        alert(
          "Profile created successfuly" +
            " tx hash: " +
            data?.createProfile?.txHash
        );
      }
    },
    onError: (error) => {
      alert(error.message);
    },
    variables: {
      request: {
        handle,
        profilePictureUri:
          "https://bafybeiawwdmmimtxqnftb2pqxxl52fvigfqybtg4zles3wcza75kbnkxvu.ipfs.dweb.link/default_profile_image.png",
      },
    },
  });

  const { data } = useQuery(GET_PROFILES, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: {
      request: {
        ownedBy: [address],
      },
    },
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-3xl my-10">Your profile</h2>
      <div className="w-1/2 flex flex-col justify-items-center ">
        {data && data.profiles.items.length > 0 ? (
          <div className="">
            <img
              className="rounded-xl w-24 "
              src={
                data.profiles?.items[0].picture?.original?.url ||
                "https://bafybeiawwdmmimtxqnftb2pqxxl52fvigfqybtg4zles3wcza75kbnkxvu.ipfs.dweb.link/default_profile_image.png"
              }
            />

            <p>Your profile handle:</p>
            <p>{data.profiles.items[0].handle}</p>
          </div>
        ) : (
          <div className="flex flex-col  h-28 justify-between">
            <input
              value={handle}
              placeholder="Select handle"
              className="border  border-gray-300 rounded-lg p-2"
              onChange={(e) => setHandle(e.target.value)}
            />
            <button
              disabled={loading}
              className="p-2 bg-zinc-800 disabled:bg-zinc-500 text-white rounded-lg ml-1"
              onClick={createProfile}
            >
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateProfileForm;
