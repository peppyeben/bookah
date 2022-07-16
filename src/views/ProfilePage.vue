<template>
  <ErrorModal v-if="$store.state.error" @closeModal="reloadData">
    <template #type> Info </template>
    <template #body>
      <p class="text-xs font-bold">
        {{ $store.state.error }}
      </p>
    </template>
  </ErrorModal>
  <ErrorModal v-if="isInfoShow" @closeModal="hideInfo">
    <template #type> About </template>
    <template #body>
      <p class="text-xs font-bold">
        {{
          profile.getProfile.userDetails.description.length > 0
            ? profile.getProfile.userDetails.description
            : "No description"
        }}
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
    class="fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto"
    v-if="isCreatePending"
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
    v-if="isWithdrawPending"
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
    class="w-full transition duration-150 ease-in-out md:w-5/6 md:mx-auto"
    v-if="!isLoading"
  >
    <div v-if="profile.getProfile">
      <div
        class="flex flex-col rounded-lg shadow-lg bg-white w-full md:flex sm:flex-row"
        v-if="profile.getProfile.username != ''"
      >
        <img
          v-if="profile.getProfile.userDetails.image"
          class="rounded-full m-auto w-32 h-32 bg-cover"
          :src="profile.getProfile.userDetails.image"
          alt=""
        />
        <img
          v-else
          class="rounded-t-lg m-auto w-32 h-32 bg-cover"
          src="@/assets/logo.png"
          alt=""
        />
        <div class="p-6 m-auto flex flex-col">
          <h5
            class="text-gray-900 text-xl text-left font-medium mb-2 lg:text-right"
          >
            <span class="flex mr-auto justify-start items-start w-1/12 my-2">
              <button
                class="rounded-full appearance-none hover:text-gray-400"
                @click="showInfo"
              >
                <i
                  class="fa fa-info-circle transition duration-150 ease-in-out hover:shadow-lg"
                ></i>
              </button>
            </span>
            {{ profile.getProfile.username }}
          </h5>
          <p
            class="text-gray-700 text-left text-sm mb-1 lg:text-right"
            v-if="profile.getProfile.userDetails.description"
          >
            {{ modText(profile.getProfile.userDetails.description) }}
          </p>
          <div
            class="flex flex-col justify-start space-y-2 items-start w-full lg:justify-center lg:space-x-10 lg:flex-row lg:items-center lg:justify-between lg:space-y-0"
          >
            <p class="font-bold text-xs md:text-md">
              <i class="fa fa-dollar-sign"></i
              >{{ (profile.getProfile.balance / 100000).toFixed(2) }}
            </p>
            <button
              type="button"
              class="px-2 py-1 bg-gray-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-white hover:text-gray-900 hover:shadow-lg focus:bg-white focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-100 active:text-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              @click="withdraw"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <ul class="flex justify-between items-center list-none bg-white rounded mt-2 p-1 space-x-4">
          <router-link
            :to="{ name: 'sold'}"
            class="w-full py-2 px-4 border-2 border-x-0 border-t-0 border-b-gray-200 hover:border-b-gray-500 text-center hover:bg-gray-100"
          >Sold</router-link>
          <router-link
            :to="{ name: 'bought'}"
            class="w-full py-2 px-4 border-2 border-x-0 border-t-0 border-b-gray-200 hover:border-b-gray-500 text-center hover:bg-gray-100"
          >Bought</router-link>
      </ul>
      <router-view></router-view>
    </div>
    <div v-if="!profile.getProfile">
      <div
        class="block p-6 rounded-b-lg shadow-md bg-white md:w-2/3 md:mx-auto"
      >
        <form @submit.prevent>
          <div class="form-group mb-6">
            <label
              for="Username"
              class="form-label inline-block mb-2 text-gray-700"
              >Username <small>(required)</small></label
            >
            <input
              v-model="data.username"
              type="text"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="Username"
              aria-describedby="emailHelp"
              placeholder="ex. bookah"
            />
          </div>
          <div class="flex justify-center">
            <div class="mb-3 w-full">
              <label
                for="formFile"
                class="form-label inline-block mb-2 text-gray-700"
                >Upload Profile Image</label
              >
              <input
                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="file"
                id="formFile"
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
          <div class="flex justify-center">
            <div class="mb-3 w-full">
              <label
                for="exampleFormControlTextarea1"
                class="form-label inline-block mb-2 text-gray-700"
                >Description</label
              >
              <textarea
                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="ex. movie producer..."
                v-model="data.description"
              ></textarea>
            </div>
          </div>
          <button
            type="button"
            class="px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            @click.prevent="createAccount()"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from "vuex";
import { onMounted, onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ErrorModal from "@/components/ErrorModal.vue";
import InfoModal from "@/components/InfoModal.vue";

import { create } from "ipfs-http-client";
const client = create("https://ipfs.infura.io:5001/api/v0");

export default {
  components: { ErrorModal, InfoModal },
  setup() {
    const store = useStore();
    const router = useRouter();
    const profile = reactive({
      image: null,
      description: null,
      getProfile: null,
    });
    const data = reactive({
      username: "",
      description: "",
      image: null,
      previewImage: "",
    });
    const prev = ref(null);
    const isLoading = ref(true);
    const isCreatePending = ref(false);
    const isWithdrawPending = ref(false);
    const isInfoShow = ref(false);
    const boughtTickets = ref(null);

    onBeforeMount(async () => {
      if (!store.getters.getUserAccount) {
        store.commit("setErrorMessage", "Connect a wallet to view profile");
        router.push({ name: "home" });
      } else {
        loadData();
        setProfileDetails();
      }
    });

    onMounted(async () => {
      isLoading.value = false;
    });

    const showInfo = () => (isInfoShow.value = true);
    const hideInfo = () => (isInfoShow.value = false);
    const modText = (x) => (x.length > 20 ? x.substring(0, 20) + "..." : x);
    const reloadData = () => setProfileDetails();

    async function loadData() {
      isLoading.value = true;
      await store.dispatch("main");
      await store.dispatch("loadProfile");
      await store.dispatch("soldTickets");
      await store.dispatch("boughtTickets");
      setProfileDetails();
    }

    async function withdraw() {
      isWithdrawPending.value = true;
      await store.dispatch("withdraw");
      await loadData();
      isWithdrawPending.value = false;
    }

    function setProfileDetails() {
      let res = store.getters.getProfile;
      profile.getProfile = res;
      isLoading.value = false;
      isCreatePending.value = false;
      isWithdrawPending.value = false;
    }

    async function createAccount() {
      if (data.username.trim() != "") {
        isCreatePending.value = true;
        let res = null;
        if (data.image != null) {
          const img = await uploadToIPFS(data.image);
          const details = {
            username: data.username.replace(/\s+/g, ''),
            // username: data.username.trim(),
            image: `https://ipfs.infura.io/ipfs/${img.path}`,
            description: data.description.trim(),
          };

          await store.dispatch("createAccount", details);
          await loadData();

          isCreatePending.value = false;
        } else {
          const details = {
            username: data.username.trim(),
            description: data.description.trim(),
          };

          await store.dispatch("createAccount", details);
          await loadData();

          isCreatePending.value = false;
        }
      } else {
        store.commit("setErrorMessage", "Username field can't be empty");
      }
    }

    async function readImage(e) {
      data.previewImage = 1;
      const reader = new FileReader();
      data.image = e.target.files[0];
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => (prev.value.src = reader.result);
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

    return {
      data,
      createAccount,
      profile,
      readImage,
      prev,
      isLoading,
      isCreatePending,
      modText,
      reloadData,
      withdraw,
      isWithdrawPending,
      isInfoShow,
      showInfo,
      hideInfo,
    };
  },
};
</script>

<style scoped>

  .router-link-active,
  .router-link-exact-active {
    background-color: #dee2e6;
  }

</style>