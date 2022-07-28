import { createStore } from "vuex";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import {
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
} from "@/loadwallet.js";

export default createStore({
  state: {
    userAccount: null,
    profile: null,
    error: null,
    infoMessage: null,
    tickets: null,
    boughtTickets: null,
    soldTickets: null,
    provider: null,
    web3: null,
    web3Modal: null,
    chainId: null,
    tokenBalance: 0,
    tokenAddress: null,
  },
  getters: {
    getUserAccount(state) {
      return state.userAccount;
    },
    getProfile(state) {
      return state.profile;
    },
    getTickets(state) {
      return state.tickets;
    },
    getBoughtTickets(state) {
      return state.boughtTickets;
    },
    getSoldTickets(state) {
      return state.soldTickets;
    },
  },
  mutations: {
    setWallet(state, payload) {
      state.userAccount = payload;
    },
    setProfile(state, payload) {
      state.profile = payload;
    },
    setErrorMessage(state, payload) {
      state.error = payload;
    },
    setInfoMessage(state, payload) {
      state.infoMessage = payload;
    },
    setTickets(state, payload) {
      state.tickets = payload;
    },
    setSoldTickets(state, payload) {
      state.soldTickets = payload;
    },
    setBoughtTickets(state, payload) {
      state.boughtTickets = payload;
    },
    setProvider(state, payload) {
      state.provider = payload;
    },
    setAccount(state, payload) {
      state.userAccount = payload;
    },
    setWeb3(state, payload) {
      state.web3 = payload;
    },
    setChainID(state, payload) {
      state.chainId = payload;
    },
    setTokenBalance(state, payload) {
      state.tokenBalance = payload;
    },
    setTokenAddress(state, payload) {
      state.tokenAddress = payload;
    },
    setWeb3Modal(state) {
      let providerOptions = {
        opera: {
          package: true,
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            rpc: { 4: "https://rinkeby.infura.io/v3/" },
            network: "rinkeby",
          },
        },
      };

      state.web3Modal = new Web3Modal({
        providerOptions,
      });
    },
  },
  actions: {
    async main({ commit }) {
      commit("setWeb3Modal");
    },
    async connectWallet({ commit, dispatch, state }) {
      await dispatch("main");
      let p;
      try {
        p = await state.web3Modal.connect();
        commit("setProvider", p);
        commit("setChainID", p.chainId);
        dispatch("getAccount");
        commit("setErrorMessage", "Wallet Connected.");
      } catch (e) {
        commit("setErrorMessage", "Could not get a wallet connection, retry.");
        return;
      }

      state.provider.on("accountsChanged", (accounts) => {
        dispatch("getAccount");
        dispatch("loadProfile");
        window.location.reload();
      });
      
      state.provider.on("chainChanged", (accounts) => {
        dispatch("getAccount");
        dispatch("loadProfile");
        window.location.reload();
      });

      if (
        document
          .querySelector("#navbarSupportedContent")
          .classList.contains("show")
      ) {
        document
          .querySelector("#navbarSupportedContent")
          .classList.remove("show");
      }
    },
    async getAccount({ commit, state, dispatch }) {
      if (state.provider) {
        let web3 = new Web3(state.provider);
        commit("setWeb3", web3);
        const accounts = await state.web3.eth.getAccounts();
        commit("setAccount", accounts[0]);
        await loadContract(state.web3, state.provider);
        await dispatch("loadTokenBalance");
      } else {
        await dispatch("connectWallet");
      }
    },
    async loadTokenBalance({ commit, state }) {
      if (state.userAccount != null) {
        const tokenBalance = fromERC(await tokenContract.methods.balanceOf(state.userAccount).call(), state.web3)
        commit("setTokenBalance", tokenBalance.toString())
        commit("setTokenAddress", bookahTKNAddress)
      } else {
        await dispatch("connectWallet");
      }
    },
    async loadProfile({ commit, state, dispatch }) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          let profile;
          await ticketBookingContract.methods
            .getUser()
            .call({ from: state.userAccount }, function (error, result) {
              if (result) {
                profile = result;
                if (profile.userDetails != "0x") {
                  const userProfile = {
                    balance: profile.balance,
                    noOfTicketsCreated: profile.noOfTicketsCreated,
                    noOfTicketsCreated: profile.noOfTicketsCreated,
                    userAddress: profile.userAddress,
                    userDetails: JSON.parse(
                      bytesToStr(profile.userDetails, state.web3)
                    ),
                    username: profile.username,
                  };
                  commit("setProfile", userProfile);
                } else {
                  commit("setProfile", null);
                }
              }
              if (error) {
                commit("setErrorMessage", "Error occured while loading profile.");
              }
            });
        } else {
          commit("setErrorMessage", "Connect to the Binance Testnet network");
        }
      }
    },
    async loadTickets({ commit, state, dispatch }, payload) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          let tickets = await ticketBookingContract.methods
            .getTickets(state.userAccount)
            .call({ from: state.userAccount });

          if (tickets.length > 0) {
            const allTickets = tickets.map((ticket) => {
              const t = {
                id: ticket.id,
                price: ticket.price,
                noAvailable: ticket.noAvailable,
                seller: ticket.seller,
                dateCreated: ticket.dateCreated,
                metadata: JSON.parse(bytesToStr(ticket.metadata, state.web3)),
              };
              return t;
            });
            commit("setTickets", allTickets);
          } else {
            commit("setTickets", null);
          }

        } else {
          commit("setInfoMessage", "Connect to the Binance Testnet network");
        }
      } else {
        commit("setErrorMessage", "Connect a wallet to create/view tickets.");
      }
    },
    async createTicket({ commit, state, dispatch }, payload) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          let res;
          await ticketBookingContract.methods
            .createTicket(
              toBN(Math.floor(Math.abs(payload.price)), state.web3),
              toBN(Math.floor(Math.abs(payload.seats)), state.web3),
              strToBytes(JSON.stringify(payload.metadata), state.web3)
            )
            .send({ from: state.userAccount })
            .on("receipt", function (receipt) {
              res = receipt;
            })
            .on("error", function (error, receipt) {
              res = error;
              commit("setInfoMessage", "Oops! An errror occured, retry please.");
            });
        } else {
          commit("setErrorMessage", "Connect to the Binance Testnet network.");
        }
      } else {
        commit("setErrorMessage", "Connect wallet to create a Ticket.");
      }
    },
    async loadTicketsFromAddress({ commit, state, dispatch }, payload) {
      if (!state.userAccount) {
        const rpcURL = process.env.VUE_APP_RINKEBY_RPC_URL_WS
        state.web3 = new Web3(new Web3.providers.WebsocketProvider(rpcURL.toString()));
        const id = await state.web3.eth.net.getId();
        let contract = await new state.web3.eth.Contract(
          bookah.abi,
          bookah.address
        );
        const address = await contract.methods.usernames(payload).call();
        const tickets = await contract.methods.getTickets(address).call();
        if (tickets.length > 0) {
          const allTickets = tickets.map((ticket) => {
            const t = {
              id: ticket.id,
              price: ticket.price,
              noAvailable: ticket.noAvailable,
              seller: ticket.seller,
              dateCreated: ticket.dateCreated,
              metadata: JSON.parse(bytesToStr(ticket.metadata, state.web3)),
            };
            return t;
          });
          commit("setTickets", allTickets);
        }
      } else {
        const address = await ticketBookingContract.methods
          .usernames(payload)
          .call();
        const tickets = await ticketBookingContract.methods
          .getTickets(address)
          .call();
        if (tickets.length > 0) {
          const allTickets = tickets.map((ticket) => {
            const t = {
              id: ticket.id,
              price: ticket.price,
              noAvailable: ticket.noAvailable,
              seller: ticket.seller,
              dateCreated: ticket.dateCreated,
              metadata: JSON.parse(bytesToStr(ticket.metadata, state.web3)),
            };
            return t;
          });
          commit("setTickets", allTickets);
        }
      }
    },
    async claimToken({ commit, state, dispatch }) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          await faucetContract.methods.getToken().send({ from: state.userAccount })
            .on("receipt", function (receipt) {
              commit("setErrorMessage", "Token claimed, proceed.");
            })
            .on("error", function (error, receipt) {
              commit("setErrorMessage", "Oops! An errror occured, retry please.");
            });
        } else {
          commit("setErrorMessage", "Connect to the Binance Testnet network.");
        }
      } else {
        commit("setErrorMessage", "Connect wallet to claim token.");
      }
    },
    async createAccount({ commit, state, dispatch }, payload) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          await ticketBookingContract.methods
            .createUser(
              payload.username,
              strToBytes(JSON.stringify(payload), state.web3)
            )
            .send({ from: state.userAccount })
            .on("receipt", function (receipt) {
              dispatch("loadProfile");
              return receipt;
            })
            .on("error", function (error, receipt) {
              commit("setErrorMessage", "Oops! An errror occured, retry please.");
              dispatch("loadProfile");
            });
        } else {
          commit("setErrorMessage", "Connect to the Binance Testnet network.");
        }
      } else {
        commit("setErrorMessage", "Connect wallet to create an account.");
      }
    },
    async bookTicket({ commit, state, dispatch }, payload) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          const ticket = await ticketBookingContract.methods
            .getTicket(payload.seller, payload.id)
            .call();

          const ticketPrice = Math.floor(ticket.price / 100000);

          const allowance = await tokenContract.methods
            .allowance(state.userAccount, ticketBookingContract._address)
            .call();

          const allowanceBN = (toBN(allowance, state.web3)).toString()
          const ticketPriceBN = (toBN(
            toERC(ticketPrice * Math.floor(Math.abs(payload.noOfTicketsToBuy)),state.web3),
            state.web3
          )).toString()

          if (
            Math.floor(fromERC(allowanceBN, state.web3)) >
            Math.floor(fromERC(ticketPriceBN, state.web3))
          ) {
            await ticketBookingContract.methods
              .buyTicket(payload.id, Math.abs(payload.noOfTicketsToBuy), payload.seller)
              .send({ from: state.userAccount })
              .on("receipt", function (receipt) {
                commit("setInfoMessage", "Ticket successfully booked.");
              })
              .on("error", function (error, receipt) {
                commit(
                  "setErrorMessage",
                  "Oops! An error occured, retry please."
                );
              });
          } else {
            await tokenContract.methods
              .increaseAllowance(
                ticketBookingContract._address,
                toERC("100000000", state.web3)
              )
              .send({ from: state.userAccount })
              .on("receipt", async function (receipt) {
                dispatch("bookTicket", payload);
              })
              .on("error", function (error, receipt) {
                commit(
                  "setErrorMessage",
                  "Oops! An error occured, retry please."
                );
              });
          }

        } else {
          commit("setInfoMessage", "Connect to the Binance Testnet network.");
        }
      } else {
        commit("setInfoMessage", "Connect wallet to book a ticket.");
      }
    },
    async withdraw({ commit, state, dispatch }, payload) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          await ticketBookingContract.methods
            .withdraw()
            .send({ from: state.userAccount })
            .on("receipt", function (receipt) {
              commit("setInfoMessage", "Withdrawal successful.");
              dispatch("loadProfile");
            })
            .on("error", function (error, receipt) {
              commit("setErrorMessage", "Oops! An error occured, retry please.");
            });
        } else {
          commit("setInfoMessage", "Connect to the Binance Testnet network.");
        }
      } else {
        commit("setInfoMessage", "Connect wallet to withdraw.");
      }
    },
    async disconnectWallet({ commit, state, dispatch }) {
      if (state.provider.close) {
        await state.provider.close();
        await web3Modal.clearCachedProvider();
        commit("setProvider", null);
      }
      await state.web3Modal.clearCachedProvider();
      window.location.reload();
    },
    async boughtTickets({ commit, state, dispatch }) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          await ticketBookingContract.getPastEvents(
            "BoughtTicket",
            {
              filter: { buyerAddress: state.userAccount },
              fromBlock: 0,
              toBlock: "latest",
            },
            async (err, events) => {
              if (events && events.length > 0) {
                const allBoughtEvents = events.map((event) => {
                  return event.returnValues;
                });
                let y = []
                for (const ticket of allBoughtEvents) {
                  const t = await ticketBookingContract.methods
                    .getTicket(ticket.sellerAddress, ticket.id)
                    .call();
                  const u = await ticketBookingContract.methods
                    .userAddresses(ticket.sellerAddress)
                    .call();

                  y.push({
                    metadata: JSON.parse(bytesToStr(t.metadata, state.web3)),
                    sellerUsername: u,
                    noOfTicketsBought: ticket.noOfTicketsBought
                  });
                }
                commit("setBoughtTickets", y)
              } else {
                commit("setBoughtTickets", null)
              }
            }
          );
        } else {
          commit("setBoughtTickets", null)
        }
      }
    },
    async soldTickets({ commit, state, dispatch }) {
      if (state.userAccount != null) {
        if(state.chainId == "0x4" || state.chainId == "4") {
          await ticketBookingContract.getPastEvents(
            "BoughtTicket",
            {
              filter: { sellerAddress: state.userAccount },
              fromBlock: 0,
              toBlock: "latest",
            },
            async (err, events) => {
              if (events && events.length > 0) {
                const x = events.map(event => {
                  return event.returnValues;
                })
                let y = []
                for (const el of x) {
                  const t = await ticketBookingContract.methods
                    .getTicket(el.sellerAddress, el.id)
                    .call();

                  const z = {
                    metadata: JSON.parse(bytesToStr(t.metadata, state.web3)),
                    buyerAddress: el.buyerAddress,
                    noOfTicketsBought: el.noOfTicketsBought,
                  }
                  y.push(z);
                }

                commit("setSoldTickets", y)
              } else {
                commit("setSoldTickets", null)
              }
            }
          );
        } else {
          commit("setSoldTickets", null)
        }
      }
    },
  },
  modules: {},
});
