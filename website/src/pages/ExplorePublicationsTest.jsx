import { useQuery, gql } from "@apollo/client";
import { EXPLORE_AUDIO_PUBLICATIONS } from "../graphql/explorePublications";
import React from "react";

export default function ExplorePublicationsTest() {
  const { data, loading, error } = useQuery(EXPLORE_AUDIO_PUBLICATIONS, {
    onCompleted: (data) => {
      console.log(data);
    },
  });

  return data ? (
    <div>
      {data.explorePublications.items.map((publication) => (
        <div>
          {publication.metadata.name}
          <audio controls src={publication.metadata.media[0].original.url} />
        </div>
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  );
}
