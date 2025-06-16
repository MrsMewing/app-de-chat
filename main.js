usuario = prompt("Por favor introduce tu nombre unicamente");

mensajesRecibidos = [];

function mostrarMensajes() {
    const contenedor = document.getElementById('mensajes');
    if (mensajesRecibidos.length === 0) {
        contenedor.textContent = 'No tienes mensajes';
    } else {
        contenedor.innerHTML = mensajesRecibidos.map(
            m => `<strong>${m.de}</strong> te dice: ${m.texto}`
        ).join('<hr>');
    }
}

document.getElementById('form-mensaje').addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value.trim();
    const destinatario = document.getElementById('destinatario').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    if (usuario && destinatario && mensaje) {


        // Limpia el formulario
        this.reset();
    }
});

document.getElementById('actualizar').addEventListener('click', mostrarMensajes);

mostrarMensajes();

function showLoader() {
  document.getElementById('loader-overlay').style.display = 'flex';
}

function hideLoader() {
  document.getElementById('loader-overlay').style.display = 'none';
}