import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

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

  const [createProfile, { loading }] = useMutation(CREATE_PROFILE, {
    onCompleted: (data) => {
      if (data.createProfile.__typename === "RelayError") {
        alert("Error creating profile: " + data.createProfile.reason);
      } else {
        alert(
          "Profile created successfuly" +
            " tx hash: " +
            data.createProfile.txHash
        );
      }
    },
    onError: (error) => {
      alert(error.message);
    },
    variables: {
      request: {
        handle,
      },
    },
  });

  return (
    <div>
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
  );
}

export default CreateProfileForm;
