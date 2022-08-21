import { useMemo, useState } from "react";
import * as IPFS from "ipfs";
function useIpfs() {
  const [ipfs, setIpfs] = useState();
  const [connecting, setConneting] = useState(false);
  useMemo(async () => {
    if (connecting) return;
    setConneting(true);
    const newIpfs = await IPFS.create();
    setIpfs(newIpfs);
    console.log("IPFS started");
  }, [connecting]);

  return { ipfs };
}

export default useIpfs;
