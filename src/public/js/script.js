const socket = io()

const button  = document.getElementById('sendChat')
const parrafo = document.getElementById('mensajesChat')
const valInput = document.getElementById('chatBox')

let user;

Swal.fire({
    title: "identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) =>{
        return !valor && "Ingrese su nombre de usuario"
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value 
    console.log(user)
})

button.addEventListener('click', () =>{
    let fechaActual = new Date().toLocaleString()

    if(valInput.value.trim().length > 0){
        socket.emit('mensaje' , {fecha: fechaActual, user: user , mensaje: valInput.value})
        valInput.value = "";
    }
})

socket.on('mensajes', (array) =>{
    parrafo.innerHTML = "";
    array.forEach(mensaje =>{
        parrafo.innerHTML += `<p>${mensaje.fecha}: ${mensaje.user} escribio: ${mensaje.mensaje}</p>`
    })
})