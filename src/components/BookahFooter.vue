<template>
  <InfoModal v-if="isInfoShow" @closeModal="hideInfo">
    <template #type>
      <h4 class="text-white font-bold text-lg">Contact</h4>
    </template>
    <template #body>
      <ul class="flex justify-center space-x-2">
        <li><a href="mailto:ebenaustine@gmail.com">
          <button class="text-left px-2 py-1 rounded bg-white border border-gray-200 w-full transition duration-500 cursor-pointer hover:bg-gray-200 focus:bg-gray-400 focus:ring-0 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24" class="w-6 h-6"><path d="M29.986 27.715H2.008C.915 27.715 0 26.85 0 25.733V6.376A2.01 2.01 0 0 1 2.008 4.37h27.978c1.093 0 2.008.9 2.008 2.008v19.33c-.025 1.144-.915 2.008-2.008 2.008z" fill="#f2f2f2"/><path d="M4 27.715l11.97-8.76.076-.508L3.7 9.578l-.025 17.705z" opacity=".1" fill="#221f1f"/><g fill="#d44c3d"><path d="M2.008 27.715C.9 27.715 0 26.85 0 25.733V6.35c0-1.118.9-1.32 2.008-1.32s2.008.23 2.008 1.32v21.364z"/><path d="M2.008 5.334c1.423 0 1.703.432 1.703 1.016v21.084H2.008c-.94 0-1.703-.762-1.703-1.703V6.35c-.025-.6.28-1.016 1.703-1.016zm0-.28C.9 5.055 0 5.283 0 6.35v19.356a1.98 1.98 0 0 0 2.008 2.008h2.008V6.35C4 5.258 3.126 5.055 2.008 5.055zm27.978.28c1.296 0 1.703.254 1.703.966v19.458c0 .94-.762 1.703-1.703 1.703h-1.703V6.3c-.025-.737.407-.966 1.703-.966zm0-.28c-1.118 0-2.008.152-2.008 1.245v21.44h2.008c1.118 0 2.008-.9 2.008-2.008V6.274c-.025-1.093-.915-1.22-2.008-1.22z"/><path d="M29.986 27.715h-2.008V6.3c0-1.118.9-1.245 2.008-1.245s2.008.152 2.008 1.245v19.458a2 2 0 0 1-2.008 1.957z"/></g><path d="M21.422 27.715L.178 7.2l1.118.457 14.8 10.647L31.993 6.63v19.128a1.99 1.99 0 0 1-2.008 1.982z" opacity=".08" fill="#221f1f"/><g fill="#d44c3d"><path d="M15.96 18.98L.864 8.028c-.9-.66-1.144-1.93-.483-2.82s1.93-1.093 2.846-.432l12.757 9.275L28.817 4.65c.9-.66 2.135-.457 2.795.457.66.9.457 2.135-.457 2.795z"/><path d="M29.986 4.572c.534 0 1.067.254 1.398.712.534.762.38 1.83-.38 2.4L15.96 18.625 1.042 7.8C.28 7.24.076 6.147.6 5.4c.305-.457.84-.737 1.423-.737.38 0 .737.102 1.016.33l12.73 9.25.178.102.178-.102 12.82-9.393c.33-.178.66-.28 1.042-.28zm0-.305c-.407 0-.84.102-1.17.38L15.984 14.05 3.202 4.75c-.33-.254-.762-.38-1.194-.38-.635.025-1.27.305-1.652.84-.635.9-.38 2.135.508 2.795L15.96 18.98 31.155 7.9a2.02 2.02 0 0 0 .457-2.795c-.407-.534-1.016-.84-1.626-.84z"/></g></svg>
          </button></a>
        </li>
        <li><a href="https://twitter.com/peppyeben">
          <button class="text-left px-2 py-1 rounded bg-white border border-gray-200 w-full transition duration-500 cursor-pointer hover:bg-gray-200 focus:bg-gray-400 focus:ring-0 focus:outline-none">
            <svg class="fill-sky-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
              <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
              />
            </svg>
          </button></a>
        </li>
        <li><a href="https://telegram.com/peppyeben">
          <button class="text-left px-2 py-1 rounded bg-white border border-gray-200 w-full transition duration-500 cursor-pointer hover:bg-gray-200 focus:bg-gray-400 focus:ring-0 focus:outline-none">
            <svg class="fill-sky-400 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
              <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
              <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"
              />
            </svg>
          </button></a>
        </li>
      </ul>
    </template>
  </InfoModal>
  <nav
    class="fixed bottom-0 inset-x-0 w-full flex flex-wrap items-center justify-between py-1 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg navbar navbar-expand-lg navbar-light mx-auto mb-1 md:py-2 lg:w-2/3"
  >
  <div
    class="flex flex-col relative bottom-0 justify-center items-center m-auto space-y-2 bg-gray-700 w-full p-3 my-1 lg:flex-row md:justify-between md:items-center"
  >
    <p class="text-center text-sm text-white py-1 md:w-3/4 lg:text-left">
      Built with <i class="text-red-500 fa fa-heart"></i> for the <i class="text-red-500 fa fa-heart"></i> of web3 by 
      <a
        href="https://twitter.com/peppyeben"
        class="text-gray-300 hover:text-gray-100"
      >
        <strong>
          <em>
            PeppyEben
          </em>
        </strong>
      </a>
    </p>
    <p class="text-center text-sm">
      <a role="button" class="text-gray-700 transition duration-200 ease-in-out bg-gray-100 py-1 px-2 rounded md:w-2/3 hover:text-white hover:bg-gray-800" @click="showInfo"><strong>Hire Me <i class="fa fa-id-badge"></i></strong>
      </a>
    </p>
  </div>
  </nav>
</template>
<script>

import { ref } from 'vue'
import InfoModal from '@/components/InfoModal.vue'

export default {
  name: "BookahFooter",
  components: { InfoModal },
  setup() {
    const isInfoShow = ref(false)

    function showInfo() {
      isInfoShow.value = true
    }

    function hideInfo() {
      isInfoShow.value = false
    }

    return {
      isInfoShow,
      showInfo,
      hideInfo,
    }
  },
};
</script>
