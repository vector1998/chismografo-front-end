<template>
        <v-dialog v-model="this.$store.getters.loginOnG" persistent max-width="600px" min-width="360px">
            <div>
                <v-tabs v-model="tab" show-arrows background-color="deep-purple accent-4" icons-and-text dark grow>
                    <v-tabs-slider color="purple darken-4"></v-tabs-slider>
                    <v-tab v-for="i in tabs" :key="i">
                        <v-icon large>{{ i.icon }}</v-icon>
                        <div class="caption py-1">{{ i.name }}</div>
                    </v-tab>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="loginForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginUsername"  label="Username" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="loginPassword" :append-icon="show1?'eye':'eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col class="d-flex" cols="12" sm="6" xsm="12">
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
                                            <v-btn x-large block :disabled="!valid" color="success" @click="login"> Login </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item>
                        <v-card class="px-4">
                            <v-card-text>
                                <v-form ref="registerForm" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="username" :rules="[rules.required]" label="Username" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="nombre" :rules="[rules.required]" label="Nombre" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="apellido_paterno" :rules="[rules.required]" label="Apellido paterno" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="apellido_materno" :rules="[rules.required]" label="Apellido materno" maxlength="20" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Contraseña" hint="Al menos 8 caracteres" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field block v-model="verify" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, passwordMatch]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Confirmar contraseña" counter @click:append="show1 = !show1"></v-text-field>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex ml-auto" cols="12" sm="3" xsm="12">
                                            <v-btn x-large block :disabled="!valid" color="success" @click="registrar">Registrar</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs>
            </div>
        </v-dialog>
</template>

<script>
import axios from 'axios';

export default{

    data: () => ({
    dialog: true,
    tab: 0,
    tabs: [
        {name:"Login", icon:"mdi-account"},
        {name:"Register", icon:"mdi-account-outline"}
    ],
    valid: true,
    
    username: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    password: "",
    verify: "",
    loginPassword: "",
    loginUsername: "",
    emailRules: [
      v => !!v || "Requerido",
      v => /.+@.+\..+/.test(v) || "E-mail debe de ser valido"
    ],

    show1: false,
    rules: {
      required: value => !!value || "Requerido.",
      min: v => (v && v.length >= 8) || "Minimo 8 caracteres"
    }
  }),

  beforeCreate(){
      let usuario = this.$store.getters.usuarioG
      console.log('usuario: ',usuario)
      if(usuario.id != undefined){
          this.$store.commit('loginOnC' , false)
      }
  },
    
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Las contraseñas deben coincidir";
    }
  },
  methods: {
    registrar() {
      let url = this.$store.getters.baseURLG + 'usuario/'
      console.log('URL Usuario: ' , url)
      let usuario = {
          username : this.username,
          nombre : this.nombre,
          apellido_paterno : this.apellido_paterno,
          apellido_materno : this.apellido_materno,
          email : this.email,
          contrasena : this.password
      }
      console.log('Usuario DATA: ' , usuario)
      axios.post(url , usuario)
              .then(response => {
                  console.log('usuario: ' , response.data)
                  this.$store.commit('usuarioC' , response.data)
                  console.log('vamonos.....')

                  let urlP = this.$store.getters.baseURLG + 'pregunta/todo/'
                  let urlR = this.$store.getters.baseURLG + 'respuesta/' + response.data.id + '/'
                  console.log('url preguntas: ' , urlP)
                  console.log('url respuestas: ' , urlR)
                  axios.get(urlP)
                          .then(response => {
                             console.log('lista preguntas: ' , response.data)
                             this.$store.commit('preguntasC' , response.data)
                             
                             axios.get(urlR)
                                .then(response => {
                                    console.log('lista respuestas: ' , response.data)
                                    this.$store.commit('respuestasC' , response.data)
                                    this.$store.commit('loginOnC' , false)
                                    this.$store.commit('cuestionarioActivoC' , true)
                                })
                                .catch(err => {
                                    console.log('error lista respuestas: ' , err)
                                })


                          })
                          .catch(err => {
                              console.log('error lista preguntas: ' , err)
                          })
  
              })
              .catch(err =>{
                  console.log('error: ' , err)
              })
      
    },
    login(){
        console.log('username: ' , this.loginUsername, 'pss: ' , this.loginPassword)
        let url = this.$store.getters.baseURLG + 'usuario/' + this.loginUsername + '/' + this.loginPassword + '/'
        console.log('URL Valida usuario: ' , url)
        if(this.loginUsername.localeCompare("") && this.loginPassword.localeCompare("")){
            axios.get(url)
                 .then(response => {
                     console.log('usuario: ' , response.data)
                     console.log('nos vamos.....')
                     this.$store.commit('loginOnC' , false)
                     this.$store.commit('usuarioC' , response.data)

                     let urlP = this.$store.getters.baseURLG + 'pregunta/todo/'
                     let urlR = this.$store.getters.baseURLG + 'respuesta/' + response.data.id + '/'
                     console.log('url preguntas: ' , urlP)
                     console.log('url respuestas: ' , urlR)
                     axios.get(urlP)
                          .then(response => {
                             console.log('lista preguntas: ' , response.data)
                             this.$store.commit('preguntasC' , response.data)
                             this.$store.commit('loginOnC' , false)
                             this.$store.commit('cuestionarioActivoC' , true)
                             this.loginUsername = ""
                             this.loginPassword = ""
                          })
                          .catch(err => {
                              console.log('error lista preguntas: ' , err)
                          })

                    axios.get(urlR)
                         .then(response => {
                            console.log('lista respuestas: ' , response.data)
                            this.$store.commit('respuestasC' , response.data)
                            this.$store.commit('loginOnC' , false)
                            this.$store.commit('cuestionarioActivoC' , true)
                         })
                        .catch(err => {
                           console.log('error lista respuestas: ' , err)
                       })

                 })
                 .catch(err => {
                     this.loginUsername = ""
                     this.loginPassword = ""
                     alert('Credenciales incorrectas')
                     console.log('error login: ' , err)
                 })
        }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
}

</script>

        