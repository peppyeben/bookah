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
	<div v-if="!isLoading">
		<ul class="list-none bg-white rounded mt-2 p-1" v-if="tickets.bought">
			<li
				class="flex justify-between items-center w-full py-2 px-4 hover:bg-gray-100"
				v-for="(ticket, i) in tickets.bought"
				:key="i"
			>
				<span>{{ modText(ticket.metadata.event) }}</span>
				<span>{{ modText(ticket.sellerUsername) }}</span>
				<span>{{ ticket.noOfTicketsBought }}</span>
			</li>
		</ul>
		<ul class="list-none bg-white rounded mt-2 p-1" v-else>
			<li class="flex justify-center items-center mx-auto w-full py-2 px-4 text-center font-semibold">
				No tickets yet.
			</li>
		</ul>
	</div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, onBeforeMount, reactive, ref, isProxy, toRaw } from "vue";
import truncateEthAddress from "truncate-eth-address";

export default {
	name: "BoughtTickets",
	setup() {
		const store = useStore();
		const isLoading = ref(true);
		const tickets = reactive({
			bought: null,
		});

		onBeforeMount(async () => {
			await loadBoughtTickets();
		});

		onMounted(async () => {
			isLoading.value = false;
		});

		const ethAddress = (x) => truncateEthAddress(x);
		const modText = (x) => (x.length > 20 ? x.substring(0, 20) + "..." : x);

		async function loadBoughtTickets() {
			isLoading.value = true;
			await store.dispatch("boughtTickets");
			let s = store.getters.getBoughtTickets;
			let t = isProxy(s) ? toRaw(s) : s;
			tickets.bought = t;
			isLoading.value = false;
		}

		return {
			tickets,
			isLoading,
			ethAddress,
			modText,
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
