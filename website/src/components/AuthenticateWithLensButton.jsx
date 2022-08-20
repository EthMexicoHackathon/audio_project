import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useAccount, useSignMessage } from "wagmi";
const GET_CHALLENGE = gql`
  query ($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

const AUTHENTICATION = gql`
  mutation ($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

export default function AuthenticateWithLensButton() {
  const { address, isConnecting, isConnected } = useAccount();
  const [challenge, setChallenge] = useState("");
  const [signature, setSignature] = useState("");
  const [authenticate] = useMutation(AUTHENTICATION, {
    variables: { request: { address, signature } },
    onCompleted: (data) => {
      console.log(data);
      localStorage.setItem("accessToken", data.authenticate.accessToken);
      localStorage.setItem("refreshToken", data.authenticate.refreshToken);
    },
  });

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: challenge,
    onSuccess: (signature) => {
      console.log(signature);
      console.log("success");
      authenticate({ variables: { request: { address, signature } } });
    },
    onError: (error) => {
      console.log("error");
      console.log(error);
    },
  });

  const { loading, error } = useQuery(GET_CHALLENGE, {
    onCompleted: (data) => {
      console.log(data.challenge.text);
      setChallenge(data.challenge.text);
    },
    variables: {
      request: {
        address,
      },
    },
  });

  return isConnected ? (
    <div>
      <button disabled={loading} onClick={() => signMessage()}>
        Connect with lens
      </button>
    </div>
  ) : (
    <div>Please connect with web3 wallet</div>
  );
}
