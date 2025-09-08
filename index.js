 const form = document.getElementById('pubForm');
    const textarea = document.getElementById('pubText');
    const posts = document.getElementById('posts');
    const sendBtn = document.getElementById('sendBtn');

    // Habilitar/deshabilitar botón según haya texto
    textarea.addEventListener('input', () => {
      sendBtn.disabled = textarea.value.trim().length === 0;
    });

    // Atajo Ctrl+Enter para enviar
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!sendBtn.disabled) form.requestSubmit();
      }
    });

    // Formateador de fecha/hora (zona horaria de México)
    function fechaHoraMX(date = new Date()) {
      return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'America/Mexico_City'
      }).format(date);
    }

    // Render de un post
    function renderPost(texto, fecha) {
      const div = document.createElement('div');
      div.className = 'post';
      div.innerHTML = `
        <p>${escapeHTML(texto)}</p>
        <div class="meta">Enviado el ${fecha}</div>
      `;
      // Insertar arriba (más reciente primero)
      posts.prepend(div);
    }

    // Escapar HTML básico para evitar inyección
    function escapeHTML(str) {
      return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
      }[m]));
    }

    // Manejo de envío
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = textarea.value.trim();
      if (!texto) return;

      const stamp = fechaHoraMX(new Date());
      renderPost(texto, stamp);

      // (Opcional) Guardar en localStorage
      const guardados = JSON.parse(localStorage.getItem('posts') || '[]');
      guardados.unshift({ texto, stamp });
      localStorage.setItem('posts', JSON.stringify(guardados));

      textarea.value = '';
      sendBtn.disabled = true;
      textarea.focus();
    });

    // Cargar publicaciones guardadas (opcional)
    (function cargarGuardados() {
      const guardados = JSON.parse(localStorage.getItem('posts') || '[]');
      guardados.forEach(p => renderPost(p.texto, p.stamp));
    })();


    function fechaHoraMX(date = new Date()) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'America/Mexico_City'
  }).format(date);
}


// Render de un post con botón eliminar
function renderPost(texto, fecha, index = null) {
  const div = document.createElement('div');
  div.className = 'post';

  div.innerHTML = `
    <p>${escapeHTML(texto)}</p>
    <div class="meta">Enviado el ${fecha}</div>
    <button class="deleteBtn">Eliminar</button>
  `;

  // Si no nos pasan índice, es nuevo => guardamos en localStorage
  if (index === null) {
    const guardados = JSON.parse(localStorage.getItem('posts') || '[]');
    guardados.unshift({ texto, stamp: fecha });
    localStorage.setItem('posts', JSON.stringify(guardados));
    index = 0; // el más nuevo
  }

  // Listener para eliminar publicación
  div.querySelector('.deleteBtn').addEventListener('click', () => {
    // Eliminar del DOM
    div.remove();

    // Eliminar de localStorage
    const guardados = JSON.parse(localStorage.getItem('posts') || '[]');
    guardados.splice(index, 1); // quita el post
    localStorage.setItem('posts', JSON.stringify(guardados));
  });

  // Insertar arriba (más reciente primero)
  posts.prepend(div);
}

// Cargar publicaciones guardadas (con índice correcto)
(function cargarGuardados() {
  const guardados = JSON.parse(localStorage.getItem('posts') || '[]');
  guardados.forEach((p, i) => {
    renderPost(p.texto, p.stamp, i);
  });
})();



// Código de notificaciones de la pagina web 

const subscribeBtn = document.getElementById('subscribeBtn');

// Comprobar soporte de Service Worker y Push API
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => {
      console.log('Service Worker registrado', reg);
    })
    .catch(err => console.error('Error registrando SW:', err));
}

subscribeBtn.addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    alert('¡Notificaciones activadas!');
    subscribeUserToPush();
  } else {
    alert('No se activaron las notificaciones.');
  }
});

async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('<TU_PUBLIC_KEY_VAPID>')
  });
  console.log('Suscripción push:', subscription);

  // Aquí normalmente envías la suscripción a tu servidor
}
  
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon.png'
  });
});


const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const publicVapidKey = '<TU_PUBLIC_KEY_VAPID>';
const privateVapidKey = '<TU_PRIVATE_KEY_VAPID>';

webpush.setVapidDetails('mailto:tuemail@dominio.com', publicVapidKey, privateVapidKey);

app.post('/push', (req, res) => {
  const subscription = req.body.subscription;
  const payload = JSON.stringify({
    title: 'Nuevo video disponible',
    body: '¡Haz clic para ver el nuevo video!'
  });

  webpush.sendNotification(subscription, payload)
    .then(() => res.status(200).send('Notificación enviada'))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.listen(3000, () => console.log('Servidor escuchando en puerto 3000'));

 // Mostrar/Ocultar
    function toggleNotificaciones() {
      const contenedor = document.getElementById("notificaciones");
      contenedor.style.display = contenedor.style.display === "block" ? "none" : "block";
    }

    // Función para agregar notificaciones
    function nuevaNotificacion(mensaje, videoURL = null) {
      const lista = document.getElementById("listaNotificaciones");
      const li = document.createElement("li");
      li.textContent = "📢 " + mensaje;
      lista.prepend(li);

      // Si la notificación trae video, cambiar iframe
      if (videoURL) {
        document.getElementById("videoFrame").src = videoURL;
      }
    }

    // Ejemplos de notificaciones automáticas
    setTimeout(() => {
      nuevaNotificacion("Nuevo video subido", "https://www.youtube.com/embed/aqz-KE-bpKQ");
    }, 2000);

    setTimeout(() => {
      nuevaNotificacion("Transmisión en vivo ahora", "https://www.youtube.com/embed/5qap5aO4i9A");
    }, 6000);

    setTimeout(() => {
      nuevaNotificacion("Actualización importante en la página");
    }, 10000);

 function toggleLogin() {
  const box = document.getElementById("loginBox");
  box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
}


function toggleUser() {
  const box = document.getElementById("perfilBox");
  box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
}

function register() {
  const username = document.getElementById("username").value.trim();
  const profilePic = document.getElementById("profilePic").value.trim();

  if (!username) {
    alert("Por favor ingresa un nombre de usuario");
    return;
  }

  const user = { username, profilePic };
  localStorage.setItem("currentUser", JSON.stringify(user));

  mostrarUsuario();
}






function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById("profile").classList.add("hidden");
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("loginBtn").style.display = "inline-block";
}

function mostrarUsuario() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("profile").classList.remove("hidden");
    document.getElementById("loginBtn").style.display = "none";

    document.getElementById("userDisplay").textContent = user.username;
    document.getElementById("photoBox").innerHTML = user.profilePic
      ? `<img src="${user.profilePic}" alt="Foto de perfil">`
      : "<p>Sin foto de perfil</p>";
  }
}

window.onload = mostrarUsuario;

  
   // 🔹 Mostrar/Ocultar login
  function toggleLogin() {
    const box = document.getElementById("loginBox");
    box.style.display = (box.style.display === "none") ? "block" : "none";
  }

  // 🔹 Función Entrar
  function entrar() {
    const usuario = document.getElementById("usuario").value;
    const correo = document.getElementById("correo").value;
    const foto = document.getElementById("fotoPerfil").files[0];

    if (usuario && correo && foto) {
      alert("Bienvenido " + usuario);

     

      // Limpiar campos después de dar Entrar
      eliminarDatos();
    } else {
      alert("Por favor ingresa tu nombre, correo y selecciona una foto.");
    }
  }

  // 🔹 Función para eliminar datos manualmente
  function eliminarDatos() {
    document.getElementById("usuario").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("fotoPerfil").value = "";
  }


// 🔹 Función para limpiar datos del login
function eliminarDatos() {
  document.getElementById("usuario").value = "";
  document.getElementById("correo").value = "";
  document.getElementById("fotoPerfil").value = "";
}


     function entrar() {
      const usuario = document.getElementById("usuario").value;
      const foto = document.getElementById("fotoPerfil").files[0];

      if (usuario && foto) {
        // Mostrar nombre en perfil
        document.getElementById("perfilNombre").textContent = "Bienvenido, " + usuario;

        // Convertir la foto a una URL temporal y mostrarla
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("perfilFoto").src = e.target.result;
        }
        reader.readAsDataURL(foto);

        // Ocultar login y mostrar perfil
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("perfilBox").style.display = "block";
      } else {
        alert("Por favor ingresa tu nombre y selecciona una foto.");
      }
    }

    function cerrarSesion() {
      // Ocultar perfil y volver a login
      document.getElementById("perfilBox").style.display = "none";
      document.getElementById("loginBox").style.display = "block";

      // Limpiar inputs
      document.getElementById("usuario").value = "";
      document.getElementById("fotoPerfil").value = "";
      document.getElementById("perfilFoto").src = "";
      document.getElementById("perfilNombre").textContent = "";
    }

    // Cargar datos al iniciar
    window.onload = function() {
      const nombreGuardado = localStorage.getItem("nombreUsuario");
      const fotoGuardada = localStorage.getItem("fotoPerfil");

      if (nombreGuardado) {
        document.getElementById("nombrePerfil").textContent = nombreGuardado;
      }
      if (fotoGuardada) {
        document.getElementById("imgPerfil").src = fotoGuardada;
      }
    }

    // Guardar nombre y foto en localStorage
    function guardarDatos() {
      const nombre = document.getElementById("usuario").value;
      const file = document.getElementById("fotoPerfil").files[0];
      const correo = document.getElementById("correo").value;

      if (!nombre) {
        alert("Por favor escribe tu nombre.");
        return;
      }

      localStorage.setItem("nombreUsuario", nombre);
      localStorage.setItem("correoUsuario", correo);
      document.getElementById("nombrePerfil").textContent = nombre;

      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const base64 = e.target.result;
          localStorage.setItem("fotoPerfil", base64);
          document.getElementById("imgPerfil").src = base64;
        }
        reader.readAsDataURL(file);
      } else {
        alert("Por favor selecciona una foto.");
      }
    }

    // Borrar nombre y foto
    function borrarDatos() {
      localStorage.removeItem("nombreUsuario");
      localStorage.removeItem("fotoPerfil");
      document.getElementById("nombrePerfil").textContent = "";
      document.getElementById("imgPerfil").src = "";
      alert("❌ Datos eliminados");
    }
   







   


