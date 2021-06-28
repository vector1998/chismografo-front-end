import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    usuario : '',
    respuestas : [],
    preguntas : [],
    baseURL: 'http://localhost:8000/api/',
    loginOn : true,
    cuestionarioActivo : false,
    respuestasActivo : false,
    respuestasUsuarios : ""
  },
  mutations: {
    respuestasUsuariosC(state , respuestasUsuarios){
      state.respuestasUsuarios = respuestasUsuarios
    },
    cuestionarioActivoC(state , cuestionarioActivo){
      state.cuestionarioActivo = cuestionarioActivo
    },
    respuestasActivoC(state , respuestasActivo){
      state.respuestasActivo = respuestasActivo
    },
    loginOnC(state , loginOn){
      state.loginOn = loginOn
    },
    usuarioC(state , usuario){
      console.log('usuario_store : ' , usuario)
      state.usuario = usuario
    },
    preguntasC(state , preguntas){
      state.preguntas = preguntas
    },
    respuestasC(state , respuestas){
      state.respuestas = respuestas
    }
  },
  getters: {
    respuestasUsuariosG(state){
      return state.respuestasUsuarios
    },
    cuestionarioActivoG(state){
      return state.cuestionarioActivo
    },
    respuestasActivoG(state){
      return state.respuestasActivo
    },
    loginOnG(state){
      return state.loginOn
    },
    usuarioG(state){
      console.log('usuario_store_G: ' , state.usuario)
      return state.usuario
    },
    preguntasG(state){
      return state.preguntas
    },
    respuestasG(state){
      return state.respuestas
    },
    baseURLG(state){
      return state.baseURL
    }
  }
})
