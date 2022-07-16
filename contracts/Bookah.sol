// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IBookah.sol";

contract Bookah is Ownable, IBookah, ReentrancyGuard {

  address public supportedToken;
  uint private _factor_;
  uint public bookingFee;
  
  constructor() {
    _factor_ = 100000;
    // setBookingFee(2);
  }

  struct Ticket {
    uint id;
    uint price;
    uint noAvailable;
    uint dateCreated;
    bytes metadata;
    address seller;
  }

  struct User {
    string username;
    uint balance;
    uint noOfTicketsCreated;
    bytes userDetails;
    address userAddress;
  }

  struct Buyer {
    uint noOfTicketsBought;
    address buyer;
  }
  
  mapping (string => address) public usernames;
  mapping (address => string) public userAddresses;
  mapping (address => User) users;
  mapping (address => Ticket[]) tickets;
  mapping (address => mapping (uint => mapping( uint => Buyer ))) public buyerAddress;

  modifier onlyMember() { 
    require(
      users[msg.sender].userAddress != address(0),
      "No User Found"
    ); 
    _; 
  }
  
  modifier notMember(
    string memory _username
  ) { 
    require(
      users[msg.sender].userAddress == address(0),
      "Account Already Created"
    );
    require(
      usernames[_username] == address(0),
      "username Unavailable"
    );
    _; 
  }
  
  function setSupportedToken (address _tokenAddress) public onlyOwner {
    supportedToken = _tokenAddress;
    emit SupportedTokenUpdated(block.timestamp, _tokenAddress);
  }
  
  function setBookingFee (uint _newBookingFee) public onlyOwner {
    bookingFee = _newBookingFee;
    emit BookingFeeUpdated(block.timestamp, _newBookingFee);
  }

  function createUser (
    string memory _username,
    bytes memory _userDetails
  ) public notMember(_username) {

    require (
      getStringLength(_username) <= 15,
      "Length must be less/equal to 15"
    );

    // Check that there is no space in the username

    User memory _newUser = User({
      username: _username,
      balance: 0,
      noOfTicketsCreated: 0,
      userDetails: _userDetails,
      userAddress: msg.sender
    });

    users[msg.sender] = _newUser;
    usernames[_username] = msg.sender;
    userAddresses[msg.sender] = _username;
  }

  function editUserDetails (bytes memory _newUserDetails) public onlyMember {
    User memory _oldUser = users[msg.sender];

    User memory _newUser = User({
      username: _oldUser.username,
      balance: _oldUser.balance,
      noOfTicketsCreated: _oldUser.noOfTicketsCreated,
      userDetails: _newUserDetails,
      userAddress: _oldUser.userAddress
    });

    users[msg.sender] = _newUser;
  }
  
  function createTicket (
    uint _price,
    uint _noAvailable,
    bytes memory _metadata
  ) public onlyMember {
    require(
      (_price * _factor_) > 0,
      "Price Can't Be 0"
    );

    require(
      _noAvailable > 0,
      "Available Can't Be 0"
    );
    
    uint _noOfTickets = (tickets[msg.sender]).length;

    Ticket memory _newTicket = Ticket({
      id: _noOfTickets,
      price: (_price * _factor_),
      noAvailable: _noAvailable,
      dateCreated: block.timestamp,
      metadata: _metadata,
      seller: msg.sender
    });

    tickets[msg.sender].push(_newTicket);
    users[msg.sender].noOfTicketsCreated += 1;

    emit CreatedTicket(
      (_price * _factor_),
      _noOfTickets,
      msg.sender
    );
  }

  function editTicketMetadata (
    uint _ticketId,
    bytes memory _newTicketMetadata
  ) external onlyMember {
    require(
      tickets[msg.sender].length > _ticketId,
      "Invalid Ticket (doesn't exist)"
    );

    Ticket memory _oldTicket = tickets[msg.sender][_ticketId];

    Ticket memory _updatedTicket = Ticket({
      id: _oldTicket.id,
      price: _oldTicket.price,
      noAvailable: _oldTicket.noAvailable,
      dateCreated: _oldTicket.dateCreated,
      metadata: _newTicketMetadata,
      seller: _oldTicket.seller
    });

    tickets[msg.sender][_ticketId] = _updatedTicket;

    emit TicketMetadataEdited (
      block.timestamp, msg.sender
    );
  }

  function buyTicket (
    uint _ticketId,
    uint _noOfTicketsToBuy,
    address _ticketSeller
  ) external nonReentrant {
    require(
      tickets[_ticketSeller].length > _ticketId,
      "Invalid Ticket (doesn't exist)"
    );

    require(
      tickets[_ticketSeller][_ticketId].seller != msg.sender,
      "You can't buy your ticket"
    );

    uint _noOfSellerticketsAvailable = tickets[_ticketSeller][_ticketId].noAvailable;

    require(
      _noOfTicketsToBuy > 0,
      "Ticket must be more than 0"
    );
    
    require(
      _noOfSellerticketsAvailable >= _noOfTicketsToBuy,
      "Not Available Tickets"
    );

    uint _ticketPrice = (tickets[_ticketSeller][_ticketId].price * _noOfTicketsToBuy);

    require(
      ERC20(supportedToken).transferFrom(
        msg.sender,
        address(this),
        (
          getERCAmount(getTotalFee(_ticketPrice)) / _factor_
        )
      ) == true,
      "Failed to transfer Token"
    );

    users[_ticketSeller].balance += _ticketPrice;
    users[owner()].balance += _getTXFee(_ticketPrice);
    
    tickets[_ticketSeller][_ticketId].noAvailable -= _noOfTicketsToBuy;

    Buyer memory _newBuyer = Buyer({
      noOfTicketsBought: _noOfTicketsToBuy,
      buyer: msg.sender
    });

    require (
      buyerAddress[_ticketSeller][_ticketId][block.timestamp].buyer == address(0),
      "Retry Please"
    );

    buyerAddress[_ticketSeller][_ticketId][block.timestamp] = _newBuyer;

    emit BoughtTicket(
      block.timestamp,
      _ticketId,
      _noOfTicketsToBuy,
      _ticketSeller,
      msg.sender
    );
  }

  function withdraw () external nonReentrant onlyMember {
    uint _userBalance = users[msg.sender].balance;

    require(
      _userBalance > 0,
      "Nothing To Withdraw"
    );

    require(
      ERC20(supportedToken).transfer(
        msg.sender,
        (getERCAmount(_userBalance) / _factor_)
      ) == true, "Withdrawal failed"
    );

    users[msg.sender].balance = 0;

    require(
      users[msg.sender].balance == 0,
      "Error Occured On Blockchain"
    );

    emit Withdrawal(
      block.timestamp,
      _userBalance,
      msg.sender
    );
  }
  
  function getERCAmount(uint _price) internal view returns(uint) {
    return _price * (10 ** ERC20(supportedToken).decimals());
  }

  function getTickets (address _user) external view returns (Ticket[] memory) {
    return tickets[_user];
  }

  function getTicket (address _user, uint _ticketId) external view returns (Ticket memory) {
    return tickets[_user][_ticketId];
  }

  function getUser () external view returns(User memory) {
    return users[msg.sender];
  }

  function getTotalFee (uint _amount) public view returns (uint) {
    return (
      _getTXFee(_amount) + _amount
    );
  }
  
  function _getTXFee (uint _amount) private view returns (uint) {
    return (
      ((bookingFee * _amount) / 100)
    );
  }
  
  function getStringLength (string memory _s) private pure returns (uint) {
    bytes memory _b = bytes(_s);
    return _b.length;
  }
  
}
