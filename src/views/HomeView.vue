<template>
  <ErrorModal v-if="$store.state.error">
    <template #type> Info </template>
    <template #body>
      <p class="text-xs font-bold">
        {{ $store.state.error }}
      </p>
    </template>
  </ErrorModal>
  <div
    class="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto"
    v-if="isLoading"
  >
    <div
      class="flex items-center justify-center h-full overflow-hidden m-auto space-x-2"
    >
      <div
        class="spinner-grow inline-block w-12 h-12 bg-current rounded-full opacity-0"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <div
    class="relative w-full flex flex-col flex-wrap pb-24 items-center justify-center bg-gray-100 text-gray-500 m-auto"
    v-if="!isLoading"
  >
    <i class="fa fa-6x fa-ticket-alt"></i>
    <div
      class="flex justify-center items-center flex-col space-y-2 px-5 py-2 sm:p-3 my-1"
    >
      <h2 class="text-base sm:text-xl lg:text-2xl font-bold text-center">
        Create/Book tickets for your next event.
      </h2>
      <h6
        class="text-center text-xs sm:text-sm md:text-base"
        v-if="!$store.state.userAccount"
      >
        Connect a wallet to get started.
      </h6>
      <button
        class="rounded-full bg-gray-800 text-sm px-3 py-1.5 text-gray-300 hover:text-gray-100 mb-1 focus:bg-white focus:text-gray-700 focus:outline-none focus:ring-0 active:bg-gray-800 focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out"
        v-if="$store.state.userAccount != null"
        @click.prevent="disconnect"
      >
        {{ ethAddress($store.state.userAccount) }}
      </button>
      <button
        class="rounded-full bg-gray-800 text-sm px-3 py-1.5 text-gray-300 hover:text-gray-100 mb-1 focus:bg-white focus:text-gray-700 focus:outline-none focus:ring-0 active:bg-white focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out"
        v-else
        @click.prevent="connect"
      >
        Connect Wallet
      </button>
    </div>
    <div class="flex justify-center items center mx-auto space-x-3 mb-1">
      <h6
        class="text-center text-lg font-semibold px-5 sm:text-sm md:text-base"
      >
        Get BookahTKN to purchase tickets & test BSC for gas fees.
      </h6>
    </div>
    <div class="flex flex-col justify-center items center mx-auto md:space-x-3 md:flex-row">
      <button
        class="rounded-md bg-gray-800 text-sm px-3 py-1.5 text-gray-300 hover:text-gray-100 mb-1 focus:bg-white focus:text-gray-700 focus:outline-none focus:ring-0 active:bg-white focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out"
        @click.prevent="claim"
      >
        Get BookahTKN
      </button>
        <a href="https://testnet.binance.org/faucet-smart" class="rounded-md bg-amber-600 text-center text-sm px-3 py-1.5 text-white hover:text-gray-100 mb-1 focus:bg-white focus:outline-none focus:ring-0 active:bg-white focus:shadow-xl active:shadow-lg transition duration-150 ease-in-out" target="_blank">
          Get Test BSC
        </a>
    </div>
    <div class="flex flex-col justify-center items-center mt-1 mx-auto md:space-x-3 md:flex-row">
      <span class="font-bold ">
        {{ $store.state.tokenBalance }} $BKN
      </span>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import ErrorModal from "@/components/ErrorModal.vue";
import truncateEthAddress from "truncate-eth-address";

export default {
  components: {
    ErrorModal,
  },
  name: "HomeView",
  setup() {
    const store = useStore();
    const isLoading = ref(true);

    onMounted(async () => {
      isLoading.value = false;
      await store.dispatch("main");
    });

    const connect = () => store.dispatch("connectWallet");
    const disconnect = () => store.dispatch("disconnectWallet");
    const ethAddress = x => truncateEthAddress(x);
    const claim = async () => await store.dispatch("claimToken");

    return {
      isLoading,
      connect,
      ethAddress,
      disconnect,
      claim,
    };
  },
};
</script>
