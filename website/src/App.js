import { WagmiConfig, createClient } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";
import { Buffer } from "buffer";

const alchemyId = "WxH_mAU0XciJz4PAFStdOYCvYTnXwTdz";
if (!window.Buffer) window.Buffer = Buffer;

const client = createClient(
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
  })
);

const App = () => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        /* Your App */
        <ConnectKitButton />
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
