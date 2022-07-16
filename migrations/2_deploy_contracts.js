const Bookah = artifacts.require("Bookah");
const BookahTKN = artifacts.require("BookahTKN");
const BookahTKNFaucet = artifacts.require("BookahTKNFaucet");

module.exports = function(deployer) {
  deployer.deploy(Bookah);
  deployer.deploy(BookahTKN);
  deployer.deploy(BookahTKNFaucet);

  // const bookah = await Bookah.deployed()
  // const bookahTKN = await BookahTKN.deployed()
  // const bookahTKNFaucet = await BookahTKNFaucet.deployed()

  // const tokenAddress = await bookahTKN.address
  // const faucetAddress = await bookahTKNFaucet.address

  // await bookah.setSupportedToken(tokenAddress)
  // await bookahTKN.mintForFaucet(faucetAddress)
  // await bookahTKNFaucet.setFaucetTokenAddress(tokenAddress)

};
