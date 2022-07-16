// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * 
██████╗ ███████╗██████╗ ██████╗ ██╗   ██╗███████╗██████╗ ███████╗███╗   ██╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝██╔════╝██╔══██╗██╔════╝████╗  ██║
██████╔╝█████╗  ██████╔╝██████╔╝ ╚████╔╝ █████╗  ██████╔╝█████╗  ██╔██╗ ██║
██╔═══╝ ██╔══╝  ██╔═══╝ ██╔═══╝   ╚██╔╝  ██╔══╝  ██╔══██╗██╔══╝  ██║╚██╗██║
██║     ███████╗██║     ██║        ██║   ███████╗██████╔╝███████╗██║ ╚████║
╚═╝     ╚══════╝╚═╝     ╚═╝        ╚═╝   ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═══╝
                                                                            
 * **/

interface IBookah {
  
  event SupportedTokenUpdated(
    uint dateUpdated,
    address indexed tokenAddress
  );
  
  event BookingFeeUpdated(
    uint dateUpdated,
    uint newFee
  );

  event CreatedTicket(
    uint price,
    uint ticketId,
    address sellerAddress
  );
  
  event BoughtTicket(
    uint dateBought,
    uint id,
    uint noOfTicketsBought,
    address indexed sellerAddress,
    address indexed buyerAddress
  );

  event Withdrawal(
    uint dateWithdrawn,
    uint amount,
    address user
  );

  event TicketMetadataEdited(
    uint dateEdited,
    address seller
  );
  
}
