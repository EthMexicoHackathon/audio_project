import { getSigner } from "./ethersService";
import { LENS_HUB_ABI } from "./lensHubAbi";
import { ethers } from "ethers";
// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
const LENS_HUB_CONTRACT_ADDRESS = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_ABI,
  getSigner()
);
