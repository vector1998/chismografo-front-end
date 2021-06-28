<template>
  <v-app>
   <Login />
   <Cuestionario />
  </v-app>
</template>

<script>
import axios from 'axios';
import Login from '@/views/Login.vue'
import Cuestionario from '@/views/Cuestionario.vue'

export default {

  components : {
    Login,
    Cuestionario
  },
  data: () => ({
    //
    
  }),

  methods : {
    testApi(){
      console.log('test')
      let pregunta = {
         descripcion : "es una prueba de api"
      }
      axios.post('http://localhost:8000/api/pregunta/' , pregunta)
           .then(
             response => {
               console.log('todo bien ' , response.data)
             }
           )
           .catch(
             err => {
               console.log('error' , err)
             }
           )
    }
  },
};
</script>
