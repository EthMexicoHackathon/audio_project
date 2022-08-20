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

const VERIFY = gql`
  query ($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

export default function AuthenticateWithLensButton() {
  const { address, isConnected } = useAccount();
  const [challenge, setChallenge] = useState("");
  const [signature, setSignature] = useState("");

  const [authenticate] = useMutation(AUTHENTICATION, {
    variables: { request: { address, signature } },
    onCompleted: (data) => {
      console.log(`Authentication request result: ${JSON.stringify(data)}`);
      localStorage.setItem("auth_token", data.authenticate.accessToken);
      localStorage.setItem("refresh_token", data.authenticate.refreshToken);
    },
  });

  const { signMessage } = useSignMessage({
    message: challenge,
    onSuccess: (signature) => {
      console.log(`Message signed with signature: ${signature}`);
      authenticate({ variables: { request: { address, signature } } });
    },
    onError: (error) => {
      console.log(`Error signing message: ${error}`);
    },
  });

  const { loading } = useQuery(GET_CHALLENGE, {
    onCompleted: (data) => {
      console.log(`Challange received : ${data.challenge.text}`);
      setChallenge(data.challenge.text);
    },
    onError: (error) => {
      console.log(`Error getting challange: ${error}`);
    },
    variables: {
      request: {
        address,
      },
    },
  });

  return isConnected ? (
    <button
      className="p-2 bg-zinc-800 text-white rounded-xl ml-2"
      disabled={loading}
      onClick={() => signMessage()}
    >
      Connect with lens
    </button>
  ) : (
    <div></div>
  );
}
