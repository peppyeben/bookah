<template>
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
    class="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto"
    v-if="isBookingLoading"
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
  <ErrorModal v-if="$store.state.error" @closeModal="setTickets">
    <template #type> Info </template>
    <template #body>
      <p class="text-xs font-bold">
        {{ $store.state.error }}
      </p>
    </template>
  </ErrorModal>
  <InfoModal v-if="$store.state.infoMessage" @closeModal="setTickets">
    <template #type>
      <p class="text-white text-lg font-bold">Info</p>
    </template>
    <template #body>
      <p class="text-white font-medium text-sm">
        {{ $store.state.infoMessage }}
      </p>
    </template>
  </InfoModal>
  <InfoModal
    v-if="isTicketInfoToggled"
    @closeModal="isTicketInfoToggled = false"
  >
    <template #type>
      <p class="text-white font-bold text-lg">
        {{ selectedTicket.metadata.event }}
      </p>
    </template>
    <template #body>
      <div class="flex justify-center items-center flex-col space-y-2">
        <p class="text-white font-semibold text-base text-left self-start">
          {{ formatTime(selectedTicket.metadata.time).newDate }} -
          {{ formatTime(selectedTicket.metadata.time).newTime }}
        </p>
        <p class="text-white font-medium text-sm text-left">
          {{ selectedTicket.metadata.description }}
        </p>
      </div>
    </template>
  </InfoModal>
  <div
    class="grid w-full md:grid-cols-2 md:m-auto xl:grid-cols-3"
    v-if="!isLoading"
  >
    <div v-for="(ticket, i) in tickets" :key="ticket.id">
      <div class="rounded-lg shadow-lg bg-white w-full h-30">
        <div class="flex justify-center items-center space-x-3">
          <button
            class="appearance-none text-gray-800 hover:text-gray-600 hover:shadow-lg"
            @click="showTicketInfo(ticket)"
          >
            <i class="fa fa-info-circle"></i>
          </button>
          <!-- <button class="appearance-none text-gray-800 hover:text-gray-600 hover:shadow-lg">
            <i class="fa fa-info-circle"></i>
          </button> -->
        </div>
        <img
          class="rounded-t-lg m-auto w-32 bg-cover"
          src="@/assets/logo.png"
          alt=""
        />
        <div class="p-3 m-auto flex flex-col space-y-1">
          <h5
            class="text-gray-900 text-lg text-center truncate font-semibold mb-2"
          >
            {{ ticket.metadata.event }}
          </h5>
          <p class="text-gray-700 text-center text-sm mb-4">
            {{ modText(ticket.metadata.description) }}
          </p>
          <div class="flex justify-center items-center space-x-1">
            <button
              type="button"
              class="inline-block w-1/4 py-1 px-3 bg-red-900 text-white font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              @click.prevent="decrementAmountSelected(ticket)"
            >
              <i class="fa fa-minus"></i>
            </button>
            <input
              type="number"
              v-model="amountSelected[ticket.id]"
              class="w-1/2 text-center"
              max="500000"
            />
            <button
              type="button"
              class="inline-block w-1/4 py-1 px-3 bg-green-900 text-white font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              @click.prevent="incrementAmountSelected(ticket)"
            >
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <div class="flex justify-between w-full">
            <button
              type="button"
              class="px-2 py-1 bg-gray-600 text-white font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              disabled
            >
              {{ ticket.noAvailable }} <i class="fa fa-ticket-alt"></i>
            </button>
            <button
              type="button"
              class="px-2 py-1 bg-gray-600 text-white font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              disabled
            >
              <i class="fa fa-dollar-sign"></i
              >{{ (ticket.price * amountSelected[ticket.id]) / 100000 }}
            </button>
          </div>
          <button
            type="button"
            class="inline-block m-auto w-full px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
            @click.prevent="bookTicket(ticket)"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center items-center h-40 mx-auto" v-if="!isLoading">
    <div class="flex justify-center items-center h-40 mx-auto" v-if="!tickets">
      <p class="text-xl font-semibold">No tickets yet.</p>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, onBeforeMount, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";

import ErrorModal from "@/components/ErrorModal.vue";
import InfoModal from "@/components/InfoModal.vue";

export default {
  components: { ErrorModal, InfoModal },
  name: "UserTickets",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const isLoading = ref(true);
    const tickets = ref(null);
    const amountSelected = reactive([]);
    const selectedTicket = ref(null);
    const isTicketInfoToggled = ref(false);
    const isBookingLoading = ref(false);

    onMounted(async () => {});

    onBeforeMount(async () => {
      const username = route.params.user;
      await store.dispatch("loadTicketsFromAddress", username);
      await setTickets();
    });

    const modText = (x) => (x.length > 20 ? x.substring(0, 20) + "..." : x);
    const decrementAmountSelected = (ticket) =>
      amountSelected[ticket.id] > 1 ? (amountSelected[ticket.id] -= 1) : "";
    const incrementAmountSelected = (ticket) =>
      (amountSelected[ticket.id] += 1);

    function showTicketInfo(ticket) {
      isTicketInfoToggled.value = true;
      selectedTicket.value = ticket;
    }

    function formatTime(time) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: false,
      };
      const d = new Date(time);
      const newDate = new Intl.DateTimeFormat("en-US", options).format(d);
      const newHours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      const newMinutes =
        d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      const newTime = newHours + ":" + newMinutes;
      return { newDate, newTime };
    }

    async function setTickets() {
      isLoading.value = true;

      tickets.value = store.getters.getTickets;
      if (tickets.value) {
        if (tickets.value.length > 0) {
          tickets.value.forEach((val) => {
            amountSelected.push(1);
          });
        }
      }
      isLoading.value = false;
      isBookingLoading.value = false;
    }

    async function bookTicket(ticket) {
      const selectedTicket = {
        id: ticket.id,
        noOfTicketsToBuy: amountSelected[ticket.id],
        seller: ticket.seller,
      };
      isBookingLoading.value = true;
      await store.dispatch("bookTicket", selectedTicket);
      const username = route.params.user;
      await store.dispatch("loadTicketsFromAddress", username);
      await setTickets();
    }

    return {
      isLoading,
      bookTicket,
      modText,
      tickets,
      setTickets,
      amountSelected,
      incrementAmountSelected,
      decrementAmountSelected,
      showTicketInfo,
      isTicketInfoToggled,
      selectedTicket,
      formatTime,
      isBookingLoading,
    };
  },
};
</script>
