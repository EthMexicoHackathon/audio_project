import React from "react";
import AudioPlay from "../components/Audio";

export default function Home({ client }) {
  return (
    <div>
      Home
      <AudioPlay client={client} />
    </div>
  );
}
