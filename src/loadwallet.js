import bookah from './utils/bookah.js'
import bookahTKN from './utils/bookahTKN.js'
import bookahTKNFaucet from './utils/bookahTKNFaucet.js'

/* eslint-disable */

let tokenContract;
let ticketBookingContract;
let faucetContract;
let bookahTKNAddress;

const bytesToStr = (y, web3) => web3.utils.hexToAscii(y);
const strToBytes = (y, web3) => web3.utils.asciiToHex(y);
const toBN = (y, web3) => {
  const BN = web3.utils.BN
  return (new BN(y));
}
const toERC = (y, web3) =>
  web3.utils.toWei(y.toString(), "ether");
const fromERC = (y, web3) =>
  web3.utils.fromWei(y.toString(), "ether");

async function loadContract(web3, provider) {
  faucetContract = await new web3.eth.Contract(
    bookahTKNFaucet.abi,
    bookahTKNFaucet.address
  );
  ticketBookingContract = await new web3.eth.Contract(
    bookah.abi,
    bookah.address
  );
  const address = await ticketBookingContract.methods.supportedToken().call();
  tokenContract = await new web3.eth.Contract(
    bookahTKN.abi,
    bookahTKN.address
  );
  bookahTKNAddress = bookahTKN.address
}

export {
  loadContract,
  ticketBookingContract,
  bookah,
  strToBytes,
  bytesToStr,
  toBN,
  toERC,
  fromERC,
  tokenContract,
  faucetContract,
  bookahTKNAddress,
};
