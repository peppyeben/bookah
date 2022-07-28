const Bookah = artifacts.require("Bookah");
const BookahTKN = artifacts.require("BookahTKN");
const BookahTKNFaucet = artifacts.require("BookahTKNFaucet");

module.exports = function(deployer) {
  deployer.deploy(Bookah);
  deployer.deploy(BookahTKN);
  deployer.deploy(BookahTKNFaucet);
};
