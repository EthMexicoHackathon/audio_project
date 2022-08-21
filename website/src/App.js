import {
  createClient,
  WagmiConfig,
  chain,
  ContractMethodNoResultError,
} from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { useMemo, useState } from "react";
import { Buffer } from "buffer";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignMessageButton from "./components/SignMessageButton";
import ExplorePublicationsTest from "./pages/ExplorePublicationsTest";
import PublishSong from "./components/PublishSong";
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  ApolloProvider,
} from "@apollo/client";
import CreateProfileForm from "./components/CreateProfileForm";
const httpLink = new HttpLink({ uri: "https://api-mumbai.lens.dev/" });

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const token = localStorage.getItem("auth_token");

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const alchemyId = "WxH_mAU0XciJz4PAFStdOYCvYTnXwTdz";

if (!window.Buffer) window.Buffer = Buffer;

const client = createClient(
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
    chains: [chain.polygonMumbai, chain.localhost, chain.hardhat],
  })
);

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ApolloProvider client={apolloClient}>
        <ConnectKitProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExplorePublicationsTest />} />
              <Route path="/create" element={<CreateProfileForm />} />
              <Route path="/publish" element={<PublishSong />} />
            </Routes>
          </BrowserRouter>
        </ConnectKitProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
};

export default App;
