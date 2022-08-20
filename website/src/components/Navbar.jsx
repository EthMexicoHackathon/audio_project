import React from "react";
import { ConnectKitButton } from "connectkit";
import AuthenticateWithLensButton from "./AuthenticateWithLensButton";

export default function Navbar() {
  return (
    <div className="flex p-2 justify-end">
      <ConnectKitButton />
      <AuthenticateWithLensButton />
    </div>
  );
}
