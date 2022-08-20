import React, { useState, useMemo } from 'react'
import {
  Button,
  Box,
  Header,
  Heading,
  Spinner,
  Paragraph,
  Anchor,
  TextInput,
  Select,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Image,
  Tab,
  Tabs,
  Grid,
  FileInput
 } from 'grommet';

import { gql } from '@apollo/client'
import { Web3Storage } from 'web3.storage';


import {
  useNavigate,
  useParams
} from 'react-router-dom';

import { ethers } from "ethers";

import makeBlockie from 'ethereum-blockies-base64';

import useWeb3Modal from './hooks/useWeb3Modal';
import useIPFS from './hooks/useIPFS';

import FooterComponent from './components/Footer';
import { generateChallenge } from './functions/generate-challenge'
import { authenticate } from './functions/authenticate'
import { getProfiles } from './functions/getProfiles'
import {apolloClient} from './functions/apollo-client';

export default function App () {
  const [lensProfile,setLensProfile] = useState();
  const [lensT,setLensT] = useState();
  const [message,setMessage] = useState();
  const [profileName,setProfileName] = useState();
  const [file,setFile] = useState();
  const [files,setFiles] = useState();



  const loginLens = async (address) => {

    // we request a challenge from the server
    const challengeResponse = await generateChallenge(address);
    console.log(challengeResponse.data.challenge.text)
    // sign the text with the wallet
    const signer = await provider.getSigner()
    const signature = await signer.signMessage(challengeResponse.data.challenge.text)
    console.log(signature)
    const accessTokens = await authenticate(address, signature);
    console.log(accessTokens);
    return(accessTokens)
    // you now have the accessToken and the refreshToken
    // {
    //  data: {
    //   authenticate: {
    //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
    //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
    //   }
    // }
  }
  const {
    provider,
    coinbase,
    netId,
    loadWeb3Modal,
    logoutOfWeb3Modal
  } = useWeb3Modal();

  const { ipfs,ipfsErr } = useIPFS();

  const createProfile = async () => {
    const newLensT = await loginLens(coinbase);
    setLensT(newLensT);
    const response = await getProfiles(coinbase);
    if(response.data.profiles.items.length === 0){
      //Create Lens Profile
      const CREATE_PROFILE = `
        mutation($request: CreateProfileRequest!) {
          createProfile(request: $request) {
            ... on RelayerResult {
              txHash
            }
            ... on RelayError {
              reason
            }
                  __typename
          }
       }
       `

      const createLensProfile = (createProfileRequest) => {
         return apolloClient.mutate({
          mutation: gql(CREATE_PROFILE),
          variables: {
            request: createProfileRequest
          },
        });
      }
      await createLensProfile({
        handle: new Date().getTime().toString(),
      });

    }
  }

  const uploadFile = async () => {
    // Upload to web3.storage (filecoin)
    // User can use his own key soon
    setMessage(
      <>
      <Paragraph>
        Uploading to <Anchor href="web3.storage" target="_blank" rel="noreferrer">Web3.Storage</Anchor>
      </Paragraph>
      <Spinner />
      </>
    );
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGFDYjNDRDM4RTRFQTVmMEFhNWQwOWM2RTQ1YUYwOGMzRkY2NUYzY0EiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjEwMzAzNTkzNzYsIm5hbWUiOiJ0ZXN0SVBGUyJ9.HGBuR9-HTY4UX4EB3Imzdocz2JrYURnAYxffiizfXkE"
    const client = new Web3Storage({ token: testToken });
    const rootCid = await client.put(files, {
      name: `Test-${new Date().getTime().toString()}`,
      maxRetries: 3,
    });
    setMessage(
      <>
      <Paragraph>
        CID: <Anchor href={`https://nftstorage.link/ipfs/${rootCid}`} target="_blank" rel="noreferrer">Web3.Storage</Anchor>
      </Paragraph>
      </>
    );
    console.log(rootCid)
    // Pin in your local node (browser node)
    console.log(await ipfs.pin.add(rootCid));

    setTimeout(() => {
      setMessage()
    },5000)
  }

  useMemo(async () => {
    if(coinbase && !lensProfile){
      const response = await getProfiles(coinbase);
      if(response.data.profiles.items.length === 0){
        //Create Lens Profile
      }
    }
  },[coinbase,lensProfile])

  return (
        <center>

          <Header background="brand" align="start">
            <Heading margin="small"></Heading>
            <Box align="end" pad="medium" alignContent="center">
            {
              ipfs && !ipfsErr ?
              "IPFS Connected" :
              !ipfs && !ipfsErr ?
              "Loading IPFS" :
              ipfsErr &&
              "Error Loading IPFS"
            }
            </Box>
            <Box align="end" pad="medium" alignContent="center" >
              {
                coinbase ?
                <Button onClick={() => {
                  logoutOfWeb3Modal();
                }} label="Disconnect" /> :
                <Button primary onClick={loadWeb3Modal} label="Connect Wallet" />
              }
            </Box>
          </Header>
          <Heading level="2">UOU</Heading>
          {
            coinbase &&
            `Connected as ${coinbase}`
          }
          <Tabs>
            <Tab title="Your Profile">

              {
                !lensProfile &&
                <>
                <Box padding="xlarge" align="center">
                  <TextInput
                    type="text"
                    id="textInput"
                    placeholder="Enter a profile name"
                    onChange={setProfileName}
                  />
                  <Button onClick={createProfile} label="Create Lens Profile" />
                </Box>
                </>
              }
            </Tab>
            <Tab title="Upload File">
              <FileInput
                name="file"
                onChange={event => {
                  const fileList = event.target.files;
                  setFiles(fileList);
                  for (let i = 0; i < fileList.length; i += 1) {
                    const newFile = fileList[i];
                    const reader = new FileReader();
                    reader.addEventListener('load', (e) => {
                      console.log(e.target.result)
                      setFile(e.target.result)
                    });
                    reader.readAsArrayBuffer(newFile);

                  }
                }}
              />
              {
                file && ipfs &&
                <Button onClick={uploadFile} label="Upload to IPFS" />
              }
              {
                message
              }
            </Tab>
            <Tab title="View Profiles">
              <Box align="center" pad="small">

              </Box>
            </Tab>
          </Tabs>


          <FooterComponent />

        </center>
      )
}
