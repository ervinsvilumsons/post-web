<template>
  <div>
    <NavbarComponent v-if="showNavbar"/>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavbarComponent from './components/molecules/NavbarComponent.vue'

export default {
  components: { 
    NavbarComponent 
  },
  setup() {
    const route = useRoute()

    const showNavbar = computed(() => {
      return route.meta.layout === 'auth'
    })

    return { showNavbar }
  }
}
</script>
