<template>
  <nav
    class="relative w-full flex flex-wrap items-center justify-between mb-1 py-1 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg navbar navbar-expand-lg navbar-light mx-auto md:py-2"
  >
    <div
      class="container-fluid w-full flex flex-row items-center justify-between px-6"
    >
      <router-link
        :to="{ name: 'home' }"
        class="text-xl text-black font-bold hover:text-gray-600"
        >Bookah</router-link
      >
      <ul
        class="hidden navbar-nav flex-row justify-center items-center pl-0 list-style-none ml-auto lg:flex"
      >
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <router-link
            :to="{ name: 'tickets' }"
            class="nav-link text-gray-800 text-sm hover:text-gray-400 focus:text-gray-400 p-1"
            >Tickets</router-link
          >
        </li>
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <router-link
            :to="{ name: 'profile' }"
            class="nav-link text-gray-800 text-sm hover:text-gray-400 focus:text-gray-400 p-1"
            >Profile</router-link
          >
        </li>
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <button
            class="rounded-full bg-emerald-400 text-sm px-3 py-1 text-gray-900 hover:text-white hover:bg-emerald-600 mb-1"
            @click="disconnect()"
          >
            {{ ethAddress($store.state.userAccount) }}
          </button>
        </li>
        <li class="nav-item px-2" v-else>
          <button
            class="rounded-full bg-gray-800 text-sm px-3 py-1 text-gray-300 hover:text-gray-100 hover:bg-gray-900 mb-1"
            @click="connect()"
          >
            Connect Wallet
          </button>
        </li>
      </ul>
      <button
        class="navbar-toggler text-gray-500 border-0 hover:shadow-none hover:no-underline py-2 px-2.5 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none focus:no-underline lg:hidden"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fa fa-bars"></i>
      </button>
    </div>
    <div
      class="collapse navbar-collapse items-center w-full"
      id="navbarSupportedContent"
    >
      <ul
        class="navbar-nav flex flex-col justify-center items-center pl-0 list-style-none mr-auto lg:hidden"
      >
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <router-link
            :to="{ name: 'tickets' }"
            class="nav-link text-gray-800 text-sm hover:text-gray-400 focus:text-gray-400 p-1"
            >Tickets</router-link
          >
        </li>
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <router-link
            :to="{ name: 'profile' }"
            class="nav-link text-gray-800 text-sm hover:text-gray-400 focus:text-gray-400 p-1"
            >Profile</router-link
          >
        </li>
        <li class="nav-item px-2" v-if="$store.state.userAccount != null">
          <button
            class="rounded-full bg-emerald-400 text-sm px-3 py-1.5 mb-1 text-gray-900 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring-0 focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out"
            @click="disconnect()"
          >
            {{ ethAddress($store.state.userAccount) }}
          </button>
        </li>
        <li class="nav-item px-2" v-else>
          <button
            class="rounded-full bg-gray-800 text-sm px-3 py-1.5 text-gray-300 hover:text-gray-100 hover:bg-gray-900 mb-1 focus:bg-white focus:text-gray-700 focus:outline-none focus:ring-0 active:bg-gray-800 focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out"
            @click="connect()"
          >
            Connect Wallet
          </button>
        </li>
      </ul>
    </div>
    <div
      class="w-full justify-center items-center"
      :class="
        $store.state.chainId == '0x4' || $store.state.chainId == '4'
          ? 'hidden'
          : ''
      "
    >
      <p
        class="text-center text-red-700 bg-red-200 w-full py-1 font-bold text-md px-3"
      >
        Please connect to the
        <button class="appearance-none" @click="openTestnetConfig">
          <span class="text-red-900 underline"> Rinkeby Testnet </span>
        </button>
      </p>
    </div>
  </nav>
</template>
<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import truncateEthAddress from "truncate-eth-address";

export default {
  name: "NavBar",
  setup() {
    const store = useStore();

    onMounted(async () => {});

    const connect = () => store.dispatch("connectWallet");
    const disconnect = () => store.dispatch("disconnectWallet");
    const ethAddress = (x) => truncateEthAddress(x);
    const openTestnetConfig = () =>
      window.open(
        "https://coin98.net/add-rinkeby-to-metamask",
        "_blank"
      );

    return {
      connect,
      disconnect,
      ethAddress,
      openTestnetConfig,
    };
  },
};
</script>
