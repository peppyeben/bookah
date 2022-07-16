// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookahTKNFaucet is Ownable {
  address public faucetTokenAddress;
  uint private amount = 1000 * (10 ** 18);

  mapping (address => bool) isClaimed;
  
  constructor() {}

  function getToken () public {

    require (isClaimed[msg.sender] == false, "YOU CAN'T CLAIM TWICE");
    require (
      ERC20(faucetTokenAddress).balanceOf(address(this)) > amount,
      "INSUFFICIENT FUNDS IN FAUCET"
    );
    
    ERC20(faucetTokenAddress).transfer(msg.sender, amount);
    isClaimed[msg.sender] = true;
  }

  function setFaucetTokenAddress (address _newFaucetTokenAddress) public onlyOwner {
    faucetTokenAddress = _newFaucetTokenAddress;
  }
  
  
}
