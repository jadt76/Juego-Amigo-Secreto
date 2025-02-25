// Lista para almacenar los nombres
let nombres = [];

//referencias a los elementos del DOM
const inputAmigo = document.getElementById("amigo");
const listaAmigos = document.getElementById("listaAmigos");
const resultado = document.getElementById("resultado");
const errorMessage = document.getElementById("error-message");
const botonBorrar = document.getElementById("borrarLista");
const botonCopiar = document.getElementById("copiarLista");

cargarNombres();

//evento para permitir agregar con Enter en el input
inputAmigo.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        agregarAmigo();
    }
});

// Función para agregar un amigo a la lista
function agregarAmigo() {
    const nombre = inputAmigo.value.trim();

    // Validaciones
    if (nombre === "") {
        errorMessage.textContent = "Por favor, ingrese un nombre";
        return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        errorMessage.textContent = "Error: El nombre solo debe contener letras";
        return;
    }
    
    // Validación de nombre duplicado
    if (nombres.includes(nombre)) {
        errorMessage.textContent = "Error: El nombre ya está en la lista.";
        return;
    }

    // Agregar nombre a la lista
    nombres.push(nombre);
    guardarNombres();

    // Crear y agregar elemento a la lista visual
    const li = document.createElement("li");
    li.textContent = nombre;

    // Botón para borrar el nombre
    const botonBorrar = document.createElement("span");
    botonBorrar.textContent = "X";
    botonBorrar.classList.add("borrar-nombre");
    botonBorrar.addEventListener("click", function() {
        eliminarNombre(nombre, li);
    });

    li.appendChild(botonBorrar);
    li.classList.add("fade-in");
    listaAmigos.appendChild(li);
    
    mostrarExito(`"${nombre}" ha sido agregado correctamente.`);

    // Limpiar el input
    inputAmigo.value = "";
}
    // Función para eliminar un amigo de la lista
    function eliminarNombre(nombre, elementoLi) {
    // Eliminar el nombre del array
    nombres = nombres.filter(n => n !== nombre);
    guardarNombres(); // Actualizar localStorage
    // Eliminar el elemento de la lista visual
    elementoLi.remove();
    // Mostrar mensaje de éxito
    mostrarExito(`"${nombre}" ha sido eliminado correctamente.`);
}

//funcion para mostrar error
function mostrarError(mensaje) {
errorMessage.textContent = mensaje;
errorMessage.style.color = "red";
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    errorMessage.textContent = mensaje;
    errorMessage.style.color = "green";
    // Limpiar el input después de 2 segundos
    setTimeout(() => {
        errorMessage.textContent = "";
        inputAmigo.value = "";
    }, 2000);
}

// Función para borrar la lista de nombres
botonBorrar.addEventListener("click", function() {
    //Limpia el array de nombres
    nombres = [];
    //Limpia la lista visual de nombres ingresados
    listaAmigos.innerHTML = "";
    //Limpia la lista visual de nombres sorteados
    resultado.innerHTML = "";
    //limpia mensaje de error
    errorMessage.textContent = "";
    console.log("Lista de nombres borrada");
});

// Función para sortear amigos
function sortearAmigo() {
    if (nombres.length < 2) {
        errorMessage.textContent = "Se necesitan al menos 2 personas para realizar el sorteo";
        return;
    }
    // Limpiar resultados anteriores
    resultado.innerHTML = "";
    // Crear copia del array para el sorteo
    let participantes = [...nombres];
    let asignaciones = [];
    // Realizar el sorteo
    for (let i = 0; i < nombres.length; i++) {
        let donante = participantes[i];
        let receptor;
        // Asegurarse que nadie se auto-seleccione
        do {
            let indiceReceptor = Math.floor(Math.random() * participantes.length);
            receptor = participantes[indiceReceptor];
        } while (donante === receptor && participantes.length > 1);
        asignaciones.push(`${donante} → ${receptor}`);
    }
    // Mostrar resultados
    asignaciones.forEach(asignacion => {
        const li = document.createElement("li");
        li.textContent = asignacion;
        li.classList.add("fade-in");
        resultado.appendChild(li);
    });
}

// Función para copiar la lista de nombres sorteados
botonCopiar.addEventListener("click", function() {
    console.log("Botón de copiar clickeado");
    const listaSorteados = Array.from(resultado.children).map(li => li.textContent).join("\n");
    console.log("Lista de sorteados:", listaSorteados);
    navigator.clipboard.writeText(listaSorteados)
        .then(() => {
            alert("Lista de nombres sorteados copiada al portapapeles.");
        })
        .catch((error) => {
            console.error("Error al copiar la lista:", error);
            alert("Error al copiar la lista.");
        });
});

// Guardar nombres en localStorage
function guardarNombres() {
    localStorage.setItem("nombres", JSON.stringify(nombres));
}

// Cargar nombres desde localStorage al iniciar la página
function cargarNombres() {
    const nombresGuardados = JSON.parse(localStorage.getItem("nombres")) || [];
    nombres = nombresGuardados;
    nombres.forEach(nombre => {
        const li = document.createElement("li");
        li.textContent = nombre;
        // Botón para borrar el nombre
        const botonBorrar = document.createElement("span");
        botonBorrar.textContent = "X";
        botonBorrar.classList.add("borrar-nombre");
        botonBorrar.addEventListener("click", function() {
            eliminarNombre(nombre, li);
        });
        li.appendChild(botonBorrar);
        listaAmigos.appendChild(li);
    });
}

