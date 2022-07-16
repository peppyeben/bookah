<template>
  <div class="modal fixed top-0 left-0 w-full h-full z-40 outline-none overflow-x-hidden overflow-y-auto" role="dialog" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable relative w-5/6 mx-auto pointer-events-none md:4/5">
      <div class="modal-content border-none shadow-lg relative flex flex-col w-full mx-auto pointer-events-auto bg-gray-800 text-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 p-2 items-center justify-between space-x-2 md:p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl text-white font-medium leading-normal text-gray-800">
            <slot name="type"></slot>
          </h5>
          <button
            type="button"
            class="btn-close box-content bg-white rounded w-2 h-2 md:w-3 md:h-3 p-1 text-white border-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:opacity-80 hover:no-underline"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body relative p-2 md:p-4">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'InfoModal',
  emits: ["closeModal"],
  setup(props, { emit }) {
    const store = useStore()
    const modal = ref(null)

    function closeModal() {
      modal.value.classList.add("hidden")
      store.commit("setInfoMessage", null)
      emit("closeModal")
    }

    return {
      modal,
      closeModal
    }
  }
}
</script>