<template>
  <v-row justify="center">
    <v-dialog
      v-model="this.$store.getters.respuestasActivoG"
      width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Repuestas de todos los usuarios</span>
        </v-card-title>
        <v-card-text v-html="this.$store.getters.respuestasUsuariosG">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="cerrar"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

export default {

  data: () => ({
    //
    dialog : true
    
  }),

  methods : {
      cerrar(){
          this.$store.commit('respuestasActivoC' , false)
          this.$store.commit('cuestionarioActivoC' , true)
      }
  }
}
</script>
