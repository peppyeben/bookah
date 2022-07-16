<template>
  <div class="modal fixed top-2 left-0 w-full h-full z-20 outline-none overflow-x-hidden overflow-y-auto sm:top-3" role="dialog" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable relative w-2/3 m-auto pointer-events-none">
      <div class="modal-content border-2 shadow-xl relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
        <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
          <h5 class="text-xl font-medium leading-normal text-gray-800">
            <slot name="type"></slot>
          </h5>
          <button
            type="button"
            class="btn-close box-content w-3 h-3 p-1 text-red border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-red hover:opacity-80 hover:no-underline"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body relative p-4">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
  <!-- <div 
        class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
         <button type="button"
          class="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-dismiss="modal">
          Close
        </button>
      </div> -->
</template>
<script>
import { ref, onMounted, defineEmits } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ErrorModal',
  emits: ["closeModal"],
  setup(props, { emit }) {
    const store = useStore()
    const modal = ref(null)

    function closeModal() {
      modal.value.classList.add("hidden")
      store.commit("setErrorMessage", null)
      emit("closeModal")
    }

    return {
      modal,
      closeModal
    }
  }
}
</script>