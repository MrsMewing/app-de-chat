let nombre_usuario;
do {
    nombre_usuario = prompt("Por favor introduce tu nombre y que no este vacio").trim();
} while (nombre_usuario.length < 1);

//iniciamos una animacion de carga para esperar la respuesta del servidor
showLoader();

fetch("http://127.0.0.1:5000/autentificacion", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({"usuario": nombre_usuario})
})
.then((respuesta) => {
    if(!respuesta.ok) throw new Error(respuesta.statusText);
    return respuesta.json();
})
.then((datos) => {
    alert(datos.respuesta);
    localStorage.setItem("nombre_usuario", nombre_usuario);
})
.catch((error) => {
    alert(error);
    localStorage.setItem("nombre_usuario", "No disponible");
})
.finally(() => {
    //finaliza la animacion cuando el servidor haya respondido o haya ocurrido algun error
    hideLoader();
    
    const usuario = localStorage.getItem("nombre_usuario");
    document.getElementById("texto_nombre_usuario").innerText = usuario;
})

async function verificar_solicitud(solicitud) {
    try{
        const respuesta = await solicitud;

        if(!respuesta.ok) throw new Error(solicitud.status);

        const contenido = await respuesta.json();
        return [contenido.respuesta, null];
    }
    catch(error){
        return [null, error];
    }
}

document.getElementById('form-mensaje').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('texto_nombre_usuario').innerText.trim();
    const destinatario = document.getElementById('destinatario').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    if (usuario != " " && destinatario != " " && mensaje != " ") {
        showLoader();
        verificar_solicitud(fetch(`http://127.0.0.1:5000/agregar_mensajes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({origen: usuario, destino: destinatario, mensaje: mensaje})
        })).then(([respuesta, error]) => {
            if(error) throw new Error(error);

            alert(respuesta);

        }).catch((error) => {
            alert(error)
        }).finally(()=> {
            hideLoader();
            
            // Limpia el formulario
            this.reset();
        });
    }
    else{
        alert("Alguno de los inputs esta vacio, por rellena con la informacion")
    }
});

//probar en otros dispositivos, ya que si lo pruebo en mi maquina local, los datos en el localstorage se sobre escriben y se bugean la app
document.getElementById('actualizar').addEventListener('click', () => {
    const contenedor = document.getElementById('mensajes');
    const nombre_usuario = localStorage.getItem("nombre_usuario")

    showLoader();

    const parametros = new URLSearchParams();
    parametros.set("nombre_usuario", nombre_usuario);

    verificar_solicitud(fetch(`http://127.0.0.1:5000/obtener_mensajes?${parametros.toString()}`))
    .then(([respuesta, error]) => {
        if(error) throw new Error(error);

        if (respuesta.length === 0) {
            contenedor.textContent = 'No tienes mensajes';
        } else {
            contenedor.innerHTML = respuesta.map(
                m => `<strong>${m.origen}</strong> te dice: ${m.mensaje}`
            ).join('<hr>');
        }
    }).catch((error) => {
        alert(error)
    })
    .finally(() => {
        hideLoader();
    })
});

function showLoader() {
  document.getElementById('loader-overlay').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader-overlay').style.display = 'none';
}

document.getElementById("destinatario").addEventListener("focus", async () =>{
    showLoader();

    const [usuarios, error] = await verificar_solicitud(fetch(`http://127.0.0.1:5000/obtener_usuarios`));
    const contenedor_opciones = document.getElementById("destinatario");
    contenedor_opciones.innerHTML = "";
    if(error){
        alert(error);
        hideLoader();
        return null;
    }

    for (let usuario of usuarios){
        const opcion = document.createElement("option");
        opcion.textContent = usuario.nombre;
        opcion.value = usuario.nombre;

        contenedor_opciones.appendChild(opcion);
    }
    hideLoader();
})