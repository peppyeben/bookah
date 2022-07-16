<template>
  <NavBar />
  <router-view v-slot="{ Component, route }" >
    <Transition name="fade">
      <div :key="route.name">
        <component :is="Component" />
      </div>
    </Transition>
  </router-view>
  <BookahFooter />
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import BookahFooter from '@/components/BookahFooter.vue'

export default {
  components: { NavBar, BookahFooter }
}
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
  }

  .fade-enter-from {
    opacity: 0;
  }

  .fade-leave-to {
    opacity: 0;
  }

</style>