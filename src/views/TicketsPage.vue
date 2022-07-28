<template>
  <div
    class="fixed top-0 left-0 w-full h-full z-50 outline-none overflow-x-hidden overflow-y-auto"
    v-if="isCreateLoading"
  >
    <div
      class="flex items-center justify-center h-full overflow-hidden m-auto space-x-2"
    >
      <div
        class="spinner-grow inline-block w-12 h-12 bg-sky-400 rounded-full opacity-0"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
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
  <div class="flex w-full transition duration-150 ease-in-out md:mx-auto">
    <button
      type="button"
      class="inline-flex items-center fixed top-15 my-1 ml-2 lg:relative lg:bottom-0"
      @click="toggleCreateForm"
    >
      <i
        class="fa fa-plus-circle fa-2x transition duration-200 ease-in-out shadow-lg hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg p-1 bg-white text-lg text-gray-600 rounded-full hover:text-white hover:bg-gray-600"
      ></i>
    </button>
  </div>

  <InfoModal v-if="$store.state.infoMessage" @closeModal="closeINFOModal">
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
  <ErrorModal v-if="createForm" @closeModal="closeERRModal">
    <template #type> New Ticket </template>
    <template #body>
      <section class="h-full gradient-form">
        <div class="container py-2 px-1 h-full">
          <div
            class="flex justify-center items-center h-full flex-wrap text-gray-800"
          >
            <div class="w-full xl:w-10/12">
              <div class="block bg-white shadow-lg rounded-lg">
                <div class="lg:flex lg:flex-wrap g-0">
                  <div class="px-0 sm:px-4">
                    <div class="p-2 md:mx-2">
                      <form>
                        <p class="mb-2">Event</p>
                        <div class="mb-4">
                          <input
                            type="text"
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="ex. Web3 Meetup"
                            v-model="data.event"
                          />
                        </div>
                        <div
                          class="flex flex-col justify-between md:g-2 md:space-x-2 md:flex-row"
                        >
                          <div>
                            <p class="mb-2">Price</p>
                            <div class="mb-4">
                              <input
                                type="number"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="ex. 20"
                                v-model="data.price"
                              />
                            </div>
                          </div>
                          <div>
                            <p class="mb-2">Seats</p>
                            <div class="mb-4">
                              <input
                                type="number"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                placeholder="ex. 160"
                                v-model="data.seats"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          class="flex flex-col justify-between md:g-2 md:space-x-2 md:flex-row"
                        >
                          <div>
                            <p class="mb-2">Date</p>
                            <div class="mb-4">
                              <input
                                type="date"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition duration-200 ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                ref="selectedDate"
                                @change="setDate"
                                @click="resetValue"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <p class="mb-2">Time</p>
                            <div class="mb-4">
                              <input
                                type="time"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition duration-200 ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                ref="selectedTime"
                                min="00:00"
                                max="23:59"
                                @change="setTime"
                                @click="resetValue"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <!-- <div> -->
                        <p class="mb-2">Description</p>
                        <div class="mb-4">
                          <textarea
                            class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Let's see how we can move web3 forward..."
                            v-model="data.description"
                            rows="5"
                          ></textarea>
                        </div>
                        <!-- </div> -->
                        <div class="flex justify-center">
                          <div class="mb-2 w-full">
                            <label
                              for="ticket-image"
                              class="form-label inline-block mb-2 text-gray-700"
                              >Upload Banner Image <small>(1x1)</small></label
                            >
                            <input
                              class="form-control block w-full px-1 py-0.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              type="file"
                              id="ticket-image"
                              @change="readImage"
                              accept=".png, .jpg, .jpeg"
                            />
                          </div>
                        </div>
                        <div
                          class="flex flex-wrap justify-center w-2/3 mx-auto"
                          v-if="data.previewImage"
                        >
                          <img
                            src=""
                            alt=""
                            class="p-1 bg-white border rounded w-32 object-cover"
                            ref="prev"
                          />
                        </div>

                        <div class="text-center pt-1 mb-2 pb-1">
                          <button
                            class="inline-block px-6 py-2.5 text-white font-semibold text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg hover:outline-none hover:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full"
                            type="button"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            id="createBTN"
                            @click="createTicket"
                          >
                            Create Ticket
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </ErrorModal>
  <div
    class="grid w-full md:grid-cols-2 md:mx-auto lg:grid-cols-3 pb-44"
    v-if="tickets"
  >
    <div v-for="(ticket, i) in tickets" :key="ticket.id">
      <div
        class="rounded-lg bg-white w-full h-30 border-x-2 border-b-2"
        :id="ticket.dateCreated"
      >
        <img
          class="rounded-t-lg m-auto w-32 bg-cover"
          src="@/assets/logo.png"
          alt=""
        />
        <div class="p-3 m-auto flex flex-col">
          <h5
            class="text-gray-900 text-lg text-center truncate font-semibold mb-2"
          >
            {{ ticket.metadata.event }}
          </h5>
          <p class="text-gray-700 text-center text-sm mb-4">
            {{ modText(ticket.metadata.description) }}
          </p>
          <div class="flex justify-between items-center">
            <button
              type="button"
              class="inline-block m-auto px-1 py-0.5 text-gray-900 italic cursor-pointer font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              @click="showTicketInfo(ticket)"
            >
              <i class="fa fa-info-circle"></i>
            </button>
            <button
              type="button"
              class="inline-block m-auto px-2 py-1 bg-transparent text-gray-900 italic font-normal text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
              disabled
            >
              {{ ticket.noAvailable }} <i class="fa fa-ticket-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="flex justify-center items-center h-fit mx-auto transition duration-150 ease-in-out"
    v-if="tickets == undefined || tickets == null"
  >
    <p class="text-xl font-semibold">No tickets yet.</p>
  </div>
</template>
<script>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { onMounted, onBeforeMount, ref, reactive } from "vue";

import * as wallet from "@/loadwallet.js";

import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");

import ErrorModal from "@/components/ErrorModal.vue";
import InfoModal from "@/components/InfoModal.vue";

export default {
  components: { ErrorModal, InfoModal },
  setup() {
    const store = useStore();
    const router = useRouter();
    const createForm = ref(false);
    const data = reactive({
      event: "",
      description: "",
      price: null,
      seats: null,
      image: null,
      previewImage: null,
      date: null,
      time: null,
      realTime: null,
    });
    const prev = ref(null);
    const selectedDate = ref(null);
    const selectedTime = ref(null);
    const isLoading = ref(false);
    const isCreateLoading = ref(false);
    const isTicketInfoToggled = ref(false);

    const tickets = ref(null);
    const ticketInfo = reactive({
      title: null,
      description: null,
      time: null,
      price: null,
    });

    const selectedTicket = ref(null);

    onMounted(async () => {
      await loadData();
      isLoading.value = false;
    });

    onBeforeMount(async () => {
      if (!store.getters.getUserAccount) {
        store.commit(
          "setErrorMessage",
          "Connect a wallet to create/view tickets"
        );
        router.push({ name: "home" });
      }
    });

    const modText = (x) => (x.length > 20 ? x.substring(0, 20) + "..." : x);
    const resetValue = (e) => (e.target.value = "");
    const toggleCreateForm = () => (createForm.value = true);
    const closeERRModal = () => (createForm.value = false);
    const setDate = (e) => (data.date = e.target.value);
    const setTime = (e) => (data.time = e.target.value);

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

    async function loadData() {
      isLoading.value = true;
      await store.dispatch("main");
      await store.dispatch("loadTickets");

      tickets.value = store.getters.getTickets;
    }

    function readImage(e) {
      data.previewImage = 1;
      const reader = new FileReader();
      data.image = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => (prev.value.src = reader.result);
    }

    function validateDateAndTime() {
      if (
        data.date == "" ||
        data.date == null ||
        data.time == "" ||
        data.time == null
      )
        return;
      const date__ = data.date.split("-").join(", ");
      const time__ = data.time.split(":").join(", ");

      const fullDate = new Date(
        new Date(date__).setHours(time__.split(",")[0], time__.split(",")[1])
      );
      data.realTime = fullDate;
    }

    async function closeINFOModal() {
      isCreateLoading.value = false;
      await loadData();
      isLoading.value = false;
      store.commit("setInfoMessage", null);
    }

    async function uploadToIPFS(x) {
      try {
        const res = await client.add(x);
        return res;
      } catch (e) {
        store.commit("setInfoMessage", "Error while uploading image");
        return null;
      }
    }

    async function createTicket() {
      validateDateAndTime();
      if (
        data.image != null &&
        data.event.trim() != "" &&
        data.description.trim() != "" &&
        (data.realTime != null || data.realTime != "") &&
        +data.price > 0 &&
        +data.seats > 0
      ) {
        isCreateLoading.value = true;
        let imageUpload = await uploadToIPFS(data.image);

        const _metadata = {
          event: data.event.trim(),
          description: data.description.trim(),
          image: imageUpload,
          time: data.realTime,
        };
        const ticket = {
          price: +data.price,
          seats: +data.seats,
          metadata: _metadata,
        };

        await store.dispatch("createTicket", ticket);
        isCreateLoading.value = false;
        await loadData();
        isLoading.value = false;
        resetForm();
        createForm.value = false;
      } else {
        store.commit("setInfoMessage", "All fields are required");
      }
    }

    function resetForm() {
      data.event = "";
      data.description = "";
      data.image = null;
      data.realTime = null;
      data.price = null;
      data.seats = null;
    }

    return {
      toggleCreateForm,
      createForm,
      closeERRModal,
      closeINFOModal,
      data,
      prev,
      readImage,
      selectedDate,
      selectedTime,
      setDate,
      setTime,
      resetValue,
      createTicket,
      tickets,
      isCreateLoading,
      isLoading,
      modText,
      showTicketInfo,
      isTicketInfoToggled,
      selectedTicket,
      formatTime,
    };
  },
};
</script>
<style scoped>
#createBTN {
  background: linear-gradient(to right, #bcbcbc, #3f3f3f, #9a9a9a, #626262);
}
</style>
