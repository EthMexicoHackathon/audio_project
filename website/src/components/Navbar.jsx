import React from "react";
import { ConnectKitButton } from "connectkit";
import AuthenticateWithLensButton from "./AuthenticateWithLensButton";
import { gql, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const VERIFY = gql`
  query ($request: VerifyRequest!) {
    verify(request: $request)
  }
`;

const locations = ["Explore", "Profile", "Publish"];

function Navbar() {
  const accessToken = localStorage.getItem("auth_token") || "";
  const { address, isConnected } = useAccount();

  const { loading, error, data } = useQuery(VERIFY, {
    variables: { request: { accessToken } },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  const navigate = useNavigate();

  return (
    <div className="flex p-2 justify-between">
      <div className="flex ">
        <img
          src={Logo}
          alt="logo"
          onClick={() => navigate("/explore")}
          className="w-12 ml-2 cursor-pointer  h-12"
        />
        {locations.map((location) => (
          <p
            onClick={() => navigate(location)}
            className="p-2 mt-0.5 font-semibold cursor-pointer"
          >
            {location}
          </p>
        ))}
      </div>

      <div className="flex">
        <ConnectKitButton />
        {isConnected && data && data.verify ? (
          <div></div>
        ) : (
          <AuthenticateWithLensButton />
        )}
      </div>
    </div>
  );
}

export default Navbar;
