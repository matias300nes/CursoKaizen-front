//crear lista con personas
personas = [];

var socket;

//cada uno debe poner sus datos aqui
const Me = {
  nombre: "Matias",
  apellido: "Endres",
};

//traigo el componente boton
const formulario = document.querySelector("#formulario");

//evento de submit en el formulario
formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  //traer informacion de formulario
  persona = {
    id: Date.now(),
    nombre: document.querySelector("#inputNombre").value,
    apellido: document.querySelector("#inputApellido").value,
    fecha: document.querySelector("#inputFecha").value,
    color: document.querySelector("#inputColor").value,
    email: document.querySelector("#inputEmail").value,
  };

  socket.emit("new", persona, Me);

  formulario.reset();
});

//creo una funcion para el boton
function Agregar(persona) {
  personas.push(persona);

  //traer el elemento tabla
  var tabla = document.querySelector("#tableContent");

  //creo elemento fila
  var fila = document.createElement("tr");

  //id de fila
  fila.id = persona.id;

  fila.innerHTML = `
        <td>${persona.nombre}</td>
        <td>${persona.apellido}</td>
        <td>${persona.fecha}</td>
        <td><button class="button-round" style="background-color: ${persona.color};"></button></td>
        <td>${persona.email}</td>
        <td><button class="button-round delete" onclick="Eliminar(${persona.id})"><i class="fa-solid fa-trash"></i></button></td>
    `;

  tabla.appendChild(fila);
}

function Eliminar(id) {
  socket.emit("delete", id, Me);
}

//evento chkTema
var btnTema = document.querySelector("#btnTema");
btnTema.addEventListener("click", cambiarTema);
var checkbox = document.querySelector("#chkTema");

function cambiarTema() {
  checkbox.checked = !checkbox.checked;
  var root = document.querySelector(":root");
  if (checkbox.checked) {
    //poner el tema en oscuro
    root.style.setProperty("--primary", "#5d5d5d");
    root.style.setProperty("--primary-light", "#5d5d5d");
    root.style.setProperty("--light", "#313131");
    root.style.setProperty("--dark", "#eaf4f4");
    root.style.setProperty("--background", "#3a3a3c");
    root.style.setProperty("--white", "#3a3a3c");
    root.style.setProperty("--gray", "#1c1c1e");
    btnTema.innerHTML = `<i class="fa-solid fa-sun"></i>`;
  } else {
    //poner el tema claro
    root.style.setProperty("--primary", "#a4c3b2");
    root.style.setProperty("--primary-light", "#cce3de");
    root.style.setProperty("--light", "#eaf4f4");
    root.style.setProperty("--dark", "#6b9080");
    root.style.setProperty("--background", "#f6fff8");
    root.style.setProperty("--white", "#f6fff8");
    root.style.setProperty("--gray", "#c7cfcf");
    btnTema.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  }
}

//traer datos de la temperatura
fetch(
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/villa%20mercedes?unitGroup=metric&key=K9KNX4P6YGSNXCJEH4W348VBW&contentType=json",
  {
    method: "GET",
    headers: {},
  }
)
  .then((response) => response.json())
  .then((data) => {
    temperatura = data.days[0].temp;

    /* alert(`La temperatura es: ${temperatura}`) */
  })
  .catch((err) => {
    console.error(err);
  });

window.onload = () => {
  socket = io("http://192.168.1.107:3000/", {
    withCredentials: false,
  });

  socket.on("recive new", (data) => {
    Agregar(data.item);
  });

  socket.on("recive delete", (data) => {
    var fila = document.getElementById(data.itemID);
    fila.remove();
  });
};
