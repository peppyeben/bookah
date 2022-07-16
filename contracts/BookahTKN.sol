// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookahTKN is ERC20, Ownable {
  uint private _supply = 500 * (10 ** decimals());
  uint private _faucetSupply = 10000000 * (10 ** decimals());
  
  constructor() ERC20("BookahTKN", "BK") {
    _mint(msg.sender, _supply);
  }

  function mintForFaucet (address _faucetAddress) public onlyOwner {
    _mint(_faucetAddress, _faucetSupply);
  }
  

}
