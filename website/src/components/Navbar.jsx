import React from "react";
import { ConnectKitButton } from "connectkit";
import AuthenticateWithLensButton from "./AuthenticateWithLensButton";
import { gql, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";

const VERIFY = gql`
  query ($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

function Navbar() {
  const accessToken = localStorage.getItem("auth_token") || "";
  const { address, isConnected } = useAccount();

  const { loading, error, data } = useQuery(VERIFY, {
    variables: { request: { accessToken } },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  return (
    <div className="flex p-2 justify-end">
      <ConnectKitButton />
      {isConnected && data && !loading && data.verify ? (
        <div></div>
      ) : (
        <AuthenticateWithLensButton />
      )}
    </div>
  );
}

export default Navbar;
