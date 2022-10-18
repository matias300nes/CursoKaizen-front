//crear lista con personas
personas = []

var socket

//cada uno debe poner sus datos aqui
const Me = {
    nombre: "Matias",
    apellido: "Endres"
} 

//traigo el componente boton
const button = document.querySelector("#btnSubmit")

//Creo un evento para el boton
button.addEventListener('click', () => {
    //traer informacion de formulario
    persona = {
        id : Date.now(),
        nombre : document.querySelector("#inputNombre").value,
        apellido : document.querySelector("#inputApellido").value,
        fecha : document.querySelector("#inputFecha").value,
        color : document.querySelector("#inputColor").value,
        email : document.querySelector("#inputEmail").value
    }

    socket.emit("new", persona, Me)
})

//creo una funcion para el boton
function Agregar(persona){

    personas.push(persona)

    //traer el elemento tabla
    var tabla = document.querySelector("#tableContent")

    //creo elemento fila
    var fila = document.createElement('tr')
    
    //id de fila
    fila.id = persona.id

    fila.innerHTML = `
        <td>${persona.nombre}</td>
        <td>${persona.apellido}</td>
        <td>${persona.fecha}</td>
        <td style="background-color: ${persona.color};"></td>
        <td>${persona.email}</td>
        <td><button class="btn btn-danger" onclick="Eliminar(${persona.id})">Eliminar</button></td>
    `

    tabla.appendChild(fila)
}

function Eliminar(id){
    socket.emit("delete", id, Me)
}


//evento chkTema
var checkbox = document.querySelector("#chkTema")
checkbox.addEventListener('change', cambiarTema)

function cambiarTema(){
    var root = document.querySelector(":root")
    if(checkbox.checked){
        //poner el tema en oscuro
        root.style.setProperty('--color1','#202020')
        root.style.setProperty('--color2','#5d5d5d')
        root.style.setProperty('--color3','#313131')
        root.style.setProperty('--color4','#ffffff')
    }else{
        //poner el tema claro
        root.style.setProperty('--color1','#ffffff')
        root.style.setProperty('--color2','#dfdfdf')
        root.style.setProperty('--color3','#808080')
        root.style.setProperty('--color4','#000000')
    }
}

//traer datos de la temperatura
fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/villa%20mercedes?unitGroup=metric&key=K9KNX4P6YGSNXCJEH4W348VBW&contentType=json", {
  "method": "GET",
  "headers": {
  }
  })
.then(response => response.json())
.then(data => {
    temperatura = data.days[0].temp

    /* alert(`La temperatura es: ${temperatura}`) */
})
.catch(err => {
  console.error(err);
});

window.onload = () => {
    socket = io('http://localhost:3000/', {
        withCredentials: false,
    });

    socket.on("recive new", data => {
        console.log(data)
        Agregar(data.item)
    });

    socket.on("recive delete", data => {
        console.log(data)
        var fila = document.getElementById(data.itemID)
        fila.remove()
    });
}




