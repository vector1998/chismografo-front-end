
<template>
    <v-dialog
      v-model="this.$store.getters.cuestionarioActivoG"
      persistent
      max-width="1000px"
    >
      <v-card>
        <v-card-title>
          <span class="headline"> {{pregunta}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
              >
                <v-text-field
                   v-model="respuesta"
                    label="Respuesta"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
                <v-col
              >
                <v-text-field
                   v-show="false"
                   v-model="updatePR"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*contesta la pregunta</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            :disabled = "contestadas"
            @click="continuar"
          >
            Continuar
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled = "!contestadas"
            @click="editar"
          >
            Editar Preguntas
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="eliminarUsuario"
          >
            Eliminar Usuario
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="verRespuestas"
          >
            Listado Respuesta
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="enviarCorreo"
          >
            Enviar Correo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default{

    data: () => ({
        esActualizacion : false,
        preguntas: [],
        respuestas: [],
        arrPR: [],
        pregunta : "pre",
        respuesta : "",
        usuario : "",
        prN : 0,
        contestadas : false 
    }),

    computed : {

        updatePR(){
        let usuario = this.$store.getters.usuarioG
        let preguntas = this.$store.getters.preguntasG
        let respuestas = this.$store.getters.respuestasG
        let arrPR = []
        console.log('usuario: ' , usuario)
        console.log('preguntas: ' , preguntas)
        console.log('respuestas: ' , respuestas)
        if(usuario.id != undefined){
            for(let p = 0; p < preguntas.length; p++ ){
                let pregunta = preguntas[p]
                let pr
                let respuestaUsuario = null

                if(respuestas != null && respuestas.length > 0){
                   respuestaUsuario = this.getRespuestaUsuario(pregunta.id , respuestas)
                }

                if(respuestaUsuario != null){
                  pr = {
                      pregunta : pregunta,
                      descripcion : pregunta.descripcion,
                      respuesta : respuestaUsuario,
                      respuestaD : respuestaUsuario.descripcion,
                  }
                  arrPR.push(pr)
                }else{
                  pr = {
                      pregunta : pregunta,
                      descripcion : pregunta.descripcion,
                      respuesta : null,
                      respuestaD : "",
                  }
                  arrPR.push(pr) 
                }
            }

        }else{
            console.log('no hay usuario')
        }

        console.log('Data preguntas respuestas: ' , arrPR)
        if(preguntas.length > 0){
            this.updatePRAT(usuario, preguntas, respuestas, arrPR)
        }
        return "x"
    }
     
    },

    methods : {
        updatePRAT(usuario, preguntas, respuestas, arrPR){
            this.usuario = usuario
            this.preguntas = preguntas
            this.respuestas = respuestas
            this.arrPR = arrPR
            this.pregunta = arrPR[0].descripcion
            this.respuesta = arrPR[0].respuestaD
            if(this.respuestas.length > 0){
                this.esActualizacion = true
            }
        },
        getRespuestaUsuario(idPregunta , respuestas){
            let respuestaUsuario = null
            for(let r = 0; r < respuestas.length; r++){
                let respuesta = respuestas[r]
                let idPreguntaR = respuesta.pregunta
                if(idPreguntaR == idPregunta){
                   respuestaUsuario = respuesta
                   break
                }
            }
            return respuestaUsuario
        },
        continuar(){
            console.log('--PRN: ' , this.prN)
            if(!this.esActualizacion){
                if(this.respuesta.localeCompare("") != 0){
                    let urlR = this.$store.getters.baseURLG + 'respuesta/'
                    console.log('URL: ' , urlR)
                    let pregunta = this.arrPR[this.prN].pregunta
                    console.log('pregunta: ' , pregunta)
                    let respuestaF = {
                        usuario : this.usuario.id,
                        pregunta : pregunta.id,
                        descripcion : this.respuesta,
                        fecha : new Date()
                    }
                    console.log('respuesta: ' , respuestaF)
                    axios.post(urlR , respuestaF)
                         .then(response => {
                             console.log('respuesta: ' , response.data)
                            this.arrPR[this.prN].respuesta = response.data
                            this.prN = this.prN + 1
                            if(this.prN >= this.arrPR.length){
                                this.pregunta = "Has concluido las preguntas"
                                this.respuesta = ""
                                this.contestadas = true
                            }else{
                                this.pregunta = this.arrPR[this.prN].descripcion
                                this.respuesta = this.arrPR[this.prN].respuestaD
                             }
                            console.log('**tamaño lista: ' , this.arrPR.length)
                            console.log('**PRN: ' , this.prN)
                            console.log('pregunta: ' , this.pregunta , ' respuesta: ' , this.respuesta)
                        })
                        .catch(err => {
                             console.log('error: ' , err)
                     })
                }else{
                    alert("El campo de respuesta no puede quedar vacio")
                }
            }else{
                if(this.respuesta.localeCompare("") != 0){
                    let respuesta = this.arrPR[this.prN].respuesta
                    respuesta.descripcion = this.respuesta
                    console.log('respuesta: ' , respuesta)
                    let urlRU = this.$store.getters.baseURLG + 'respuesta/actualizar/' + respuesta.id + '/'
                    axios.post(urlRU , respuesta)
                         .then(response => {
                             this.arrPR[this.prN].respuesta = response.data
                             this.prN = this.prN + 1
                             if(this.prN >= this.arrPR.length){
                                this.pregunta = "Has concluido las preguntas"
                                this.respuesta = ""
                                this.contestadas = true
                            }else{
                                this.pregunta = this.arrPR[this.prN].descripcion
                                this.respuesta = this.arrPR[this.prN].respuesta.descripcion
                             }
                            console.log('**tamaño lista: ' , this.arrPR.length)
                            console.log('**PRN: ' , this.prN)
                            console.log('pregunta: ' , this.pregunta , ' respuesta: ' , this.respuesta)
                         })
                         .catch(err => {
                             console.log('error: ' , err)
                         })
                }else{
                    alert("El campo de respuesta no puede quedar vacio")
                }
            }
            console.log('enviar respuesta ...........')
        },
        editar(){
            console.log('enviar respuesta ...........')
            this.esActualizacion = true
            this.prN = 0
            this.pregunta = this.arrPR[this.prN].descripcion
            this.respuesta = this.arrPR[this.prN].respuesta.descripcion
            this.contestadas = false
        },
        eliminarUsuario(){ 
            let usuario = this.usuario
            let urlUD = this.$store.getters.baseURLG + 'usuario/' + usuario.id + '/'
            if(confirm("¿estas seguro de que deseas eliminar tu usuario y respuestas?")){
                this.$store.commit('cuestionarioActivoC' , false)
                axios.delete(urlUD)
                 .then(response => {
                     console.log('delete data: ' , response.data)
                 })
                 .catch(err => {
                     console.log('error: ' , err)
                 })
                 this.esActualizacion = false
                 this.$store.commit('respuestasC' , [])
                 this.$store.commit('usuarioC' , '')
                 let vm = this
                 setTimeout(function() {
                     vm.$store.commit('loginOnC' , true)
                 } , 5000)
            }else{
              console.log('no se elimina....')   
            }
            
        },
        verRespuestas(){
            this.$store.commit('cuestionarioActivoC' , false)
            let urlRU = this.$store.getters.baseURLG + "respuesta/usuarios/"
            console.log('URL todas res: ' , urlRU)
            axios.get(urlRU)
                 .then(response => {
                     console.log(response.data)
                     let respuestas = ""
                     let listaRespuestas = response.data
                     for(let r = 0; r < listaRespuestas.length; r++){
                        respuestas = respuestas + listaRespuestas[r] + " <br/> "
                     }
                     console.log(respuestas)
                     this.$store.commit('respuestasUsuariosC' , respuestas)
                     this.$store.commit('respuestasActivoC' , true)
                 })
                 .catch(err => {
                     console.log('error: ' , err)
                 })
        },
        enviarCorreo(){
          let urlRU = this.$store.getters.baseURLG + "usuario/correo/"
          console.log('url email: ' , urlRU)
          console.log('usuario: ' , this.usuario)
          axios.post(urlRU , this.usuario)
               .then(response => {
                 console.log('correo mandado: ' , response.data)
               })
               .catch(err => {
                 console.log('error: ' , err)
               })
        }
    }

}
</script>
