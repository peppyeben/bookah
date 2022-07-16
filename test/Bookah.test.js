const Bookah = artifacts.require("Bookah");
const BookahTKN = artifacts.require("BookahTKN");

const Web3 = require("web3");
const { expect } = require("chai");

let web3 = new Web3("http://127.0.0.1:8545");

require("chai").use(require("chai-as-promised")).should();

function strToBytes(y) {
  return web3.utils.asciiToHex(y);
}

function amountERC(x) {
  return web3.utils.toWei(x.toString(), "ether").toString();
}

function toBN(a) {
  let BN = web3.utils.BN;
  return new BN(a).toString();
}

let bookahTKN,
  bookah,
  tokenAddress,
  bookahAddress,
  admin,
  movieAdmin,
  director,
  jay,
  jake;

contract("Bookah", function (accounts) {
  admin = accounts[0];
  movieAdmin = accounts[1];
  director = accounts[2];
  jay = accounts[3];
  jake = accounts[4];

  before(async () => {
    bookah = await Bookah.deployed();
    bookahAddress = await bookah.address;
    bookahTKN = await BookahTKN.deployed();
    tokenAddress = await bookahTKN.address;

    // await bookahTKN.transfer(movieAdmin, amountERC(100), { from: admin });
    // await bookahTKN.transfer(director, amountERC(100), { from: admin });
    // await bookahTKN.transfer(jay, amountERC(100), { from: admin });
    // await bookahTKN.transfer(jake, amountERC(100), { from: admin });

    await bookahTKN.increaseAllowance(bookahAddress, amountERC(100), {
      from: movieAdmin,
    });
    await bookahTKN.increaseAllowance(bookahAddress, amountERC(100), {
      from: director,
    });
    await bookahTKN.increaseAllowance(bookahAddress, amountERC(100), {
      from: jay,
    });
    await bookahTKN.increaseAllowance(bookahAddress, amountERC(100), {
      from: jake,
    });
  });

  it("creates admin account", async function () {
    await bookah.createUser("joker", strToBytes("Admin"));
    const adminProfile = await bookah.getUser();
    const adminAddress = await bookah.userAddresses(admin);
    assert.equal(adminProfile.username, "joker");
    assert.equal(adminAddress, "joker");
    assert.equal(adminProfile.userAddress, admin);
    assert.equal(adminProfile.userDetails, strToBytes("Admin"));
  });

  it("creates account for movieAdmin, director, jay", async function () {
    await bookah.createUser("movieadmin", strToBytes("Movie Admin"), {
      from: movieAdmin,
    });
    await bookah.createUser("director", strToBytes("Music Director"), {
      from: director,
    });
    await bookah.createUser("jay", strToBytes("Jay"), { from: jay });
  });

  it("creates ticket for movieAdmin", async function () {
    await bookah.createTicket(15, 50, strToBytes("First Ticket"), {
      from: movieAdmin,
    });
    const movieAdminTickets = await bookah.getTickets(movieAdmin);
    const movieAdminFirstTicket = await bookah.getTicket(movieAdmin, 0);
    const movieAdminProfile = await bookah.getUser({ from: movieAdmin });
    assert.equal(movieAdminProfile.noOfTicketsCreated, 1);
    assert.equal(movieAdminTickets.length, 1);
    assert.equal(movieAdminFirstTicket.id, 0);
    assert.equal(movieAdminFirstTicket.price, 1500000);
    assert.equal(movieAdminFirstTicket.noAvailable, 50);
    assert.equal(movieAdminFirstTicket.seller, movieAdmin);
    assert.equal(movieAdminFirstTicket.metadata, strToBytes("First Ticket"));
  });

  it("buys movieAdmin ticket for director", async function () {
    await bookah.buyTicket(0, 5, movieAdmin, { from: director });
    const movieAdminFirstTicket = await bookah.getTicket(movieAdmin, 0);
    const movieAdminProfile = await bookah.getUser({ from: movieAdmin });
    const adminProfile = await bookah.getUser();
    const directorWalletBalance = await bookahTKN.balanceOf(director);
    assert.equal(movieAdminFirstTicket.noAvailable, 45);
    assert.equal(movieAdminProfile.balance, 7500000);
    assert.equal(adminProfile.balance, 150000);
    assert.equal(directorWalletBalance.toString(), amountERC(123.5));
  });

  it("withdraws movieadmin & admin balance", async function () {
    await bookah.withdraw({ from: movieAdmin });
    await bookah.withdraw();
    const movieAdminProfile = await bookah.getUser({ from: movieAdmin });
    const adminProfile = await bookah.getUser();
    const adminWalletBalance = await bookahTKN.balanceOf(admin);
    const movieAdminWalletBalance = await bookahTKN.balanceOf(movieAdmin);
    assert.equal(movieAdminProfile.balance, 0);
    assert.equal(adminProfile.balance, 0);
    assert.equal(adminWalletBalance.toString(), amountERC(101.5));
    assert.equal(movieAdminWalletBalance.toString(), amountERC(275));
  });

  it("edits an existing user details", async function () {
    await bookah.editUserDetails(strToBytes("Music Director refurbished"), {
      from: director,
    });
    const directorProfile = await bookah.getUser({ from: director });
    assert.equal(directorProfile.username, "director");
    assert.equal(directorProfile.userAddress, director);
    assert.equal(
      directorProfile.userDetails,
      strToBytes("Music Director refurbished")
    );
  });

  it("edits an existing ticket", async function () {
    await bookah.editTicketMetadata(
      0,
      strToBytes("First Ticket has been edited"),
      {
        from: movieAdmin,
      }
    );
    const movieAdminTickets = await bookah.getTickets(movieAdmin);
    const movieAdminFirstTicket = await bookah.getTicket(movieAdmin, 0);
    assert.equal(movieAdminTickets.length, 1);
    assert.equal(movieAdminFirstTicket.id, 0);
    assert.equal(movieAdminFirstTicket.price, 1500000);
    assert.equal(movieAdminFirstTicket.noAvailable, 45);
    assert.equal(movieAdminFirstTicket.seller, movieAdmin);
    assert.equal(
      movieAdminFirstTicket.metadata,
      strToBytes("First Ticket has been edited")
    );
  });

  it("fails to edit a ticket that doesn't exist", async function () {
    await expect(
      bookah.editTicketMetadata(1, strToBytes("First Ticket"), {
        from: movieAdmin,
      })
    ).to.be.rejectedWith("Invalid Ticket (doesn't exist)");
  });

  it("fails to edit a user that doesn't exist", async function () {
    await expect(
      bookah.editUserDetails(strToBytes("I am Jake"), { from: jake })
    ).to.be.rejectedWith("No User Found");
  });

  it("fails to create an account with username length more than 15", async function () {
    await expect(
      bookah.createUser("jakewiththemoney", strToBytes("Jake's Account"), {
        from: jake,
      })
    ).to.be.rejectedWith("Length must be less/equal to 15");
  });

  it("fails to create a ticket for jake", async function () {
    await expect(
      bookah.createTicket(15, 50, strToBytes("First Ticket"), { from: jake })
    ).to.be.rejectedWith("No User Found");
  });

  it("fails to create <1 ticket for movieAdmin", async function () {
    await expect(
      bookah.createTicket(15, 0, strToBytes("First Ticket"), {
        from: movieAdmin,
      })
    ).to.be.rejectedWith("Available Can't Be 0");
  });

  it("fails to create free ticket (no price) for movieAdmin", async function () {
    await expect(
      bookah.createTicket(0, 10, strToBytes("First Ticket"), {
        from: movieAdmin,
      })
    ).to.be.rejectedWith("Price Can't Be 0");
  });

  it("fails to create another account for movieAdmin", async function () {
    await expect(
      bookah.createUser("movieadmin1", strToBytes("Movie Admin"), {
        from: movieAdmin,
      })
    ).to.be.rejectedWith("Account Already Created");
  });

  it("fails to create account with existing username", async function () {
    await expect(
      bookah.createUser("movieadmin", strToBytes("Jake's Account"), {
        from: jake,
      })
    ).to.be.rejectedWith("username Unavailable");
  });

  it("fails to purchase movieAdmin's ticket for himself(movieAdmin)", async function () {
    await expect(
      bookah.buyTicket(0, 5, movieAdmin, {
        from: movieAdmin,
      })
    ).to.be.rejectedWith("You can't buy your ticket");
  });

  it("fails to purchase a ticket that doesn't exist", async function () {
    await expect(
      bookah.buyTicket(4, 5, movieAdmin, {
        from: director,
      })
    ).to.be.rejectedWith("Invalid Ticket (doesn't exist)");
  });
});
