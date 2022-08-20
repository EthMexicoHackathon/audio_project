import { createClient, WagmiConfig, chain } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { Buffer } from "buffer";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignMessageButton from "./components/SignMessageButton";
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
      <ConnectKitProvider>
        <BrowserRouter>
          <Navbar />
          <SignMessageButton />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
