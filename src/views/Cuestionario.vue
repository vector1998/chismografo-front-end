<template>
  <div>
    <CuestionarioUI />
    <Respuestas />
 </div>
</template>

<script>
// @ is an alias to /src
import CuestionarioUI from '@/components/CuestionarioUI.vue'
import Respuestas from '@/components/Respuestas.vue'

export default {
  name: 'Cuestionario',
  components: {
    CuestionarioUI,
    Respuestas
  }
}
</script>
