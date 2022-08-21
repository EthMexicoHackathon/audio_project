import React, { useState, useMemo } from "react";
import { Web3Storage } from "web3.storage";

import useIpfs from "../hooks/useIpfs";
function PublishSong(props) {
  const [files, setFiles] = useState();
  const [file, setFile] = useState();
  const [message, setMessage] = useState();
  const { ipfs } = useIpfs();

  const uploadFile = async () => {
    // Upload to web3.storage (filecoin)
    // User can use his own key soon
    const testToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFDYjNDRDM4RTRFQTVmMEFhNWQwOWM2RTQ1YUYwOGMzRkY2NUYzY0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEwMzAzNTkzNzYsIm5hbWUiOiJ0ZXN0SVBGUyJ9.HGBuR9-HTY4UX4EB3Imzdocz2JrYURnAYxffiizfXkE";
    const client = new Web3Storage({ token: testToken });
    const rootCid = await client.put(files, {
      name: `Test-${new Date().getTime().toString()}`,
      maxRetries: 3,
    });

    console.log(rootCid);
    //console.log(await ipfs.pin.add(rootCid));

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div>
      <button onClick={() => console.log(ipfs)}>test</button>
      <input
        type="file"
        onChange={(event) => {
          const fileList = event.target.files;
          setFiles(fileList);
          for (let i = 0; i < fileList.length; i += 1) {
            const newFile = fileList[i];
            const reader = new FileReader();
            reader.addEventListener("load", (e) => {
              console.log(e.target.result);
              console.log(ipfs);
              setFile(e.target.result);
            });
            reader.readAsArrayBuffer(newFile);
            console.log(file);
          }
        }}
      />
      {file && <button onClick={uploadFile}>Upload to IPFS</button>}
    </div>
  );
}

export default PublishSong;
