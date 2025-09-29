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
    }
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



function obtenerUsuarios() {
      return JSON.parse(localStorage.getItem("usuarios")) || [];
    }

    function guardarUsuarios(lista) {
      localStorage.setItem("usuarios", JSON.stringify(lista));
    }

    function entrar() {
      const usuario = document.getElementById("usuario").value;
      const correo = document.getElementById("correo").value;
      const fotoInput = document.getElementById("fotoPerfil").files[0];

      if (!usuario || !correo || !fotoInput) {
        alert("Por favor completa todos los campos.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const foto = e.target.result;

        let usuarios = obtenerUsuarios();
        const nuevo = { nombre: usuario, correo: correo, foto: foto };

        usuarios.push(nuevo);
        guardarUsuarios(usuarios);

        // Guardar este usuario como "actual"
        localStorage.setItem("usuarioActual", JSON.stringify(nuevo));

        renderUsuarios();
        mostrarPerfil();

        document.getElementById("usuario").value = "";
        document.getElementById("correo").value = "";
        document.getElementById("fotoPerfil").value = "";
      };
      reader.readAsDataURL(fotoInput);
    }

    function renderUsuarios() {
      const frame = document.getElementById("usuariosFrame");
      frame.innerHTML = "";

      const usuarios = obtenerUsuarios();
      usuarios.forEach(user => {
        const div = document.createElement("div");
        div.classList.add("usuario");

        div.innerHTML = `
          <img src="${user.foto}" alt="Foto de ${user.nombre}">
          <div><strong>${user.nombre}</strong></div>
          <div class="info">${user.nombre}<br>${user.correo}</div>
        `;

        frame.appendChild(div);
      });
    }

    function mostrarPerfil() {
      const actual = JSON.parse(localStorage.getItem("usuarioActual"));
      if (actual) {
        document.getElementById("perfilFoto").src = actual.foto;
        document.getElementById("perfilNombre").textContent = actual.nombre;
      }
    }

    function toggleUser() {
      const box = document.getElementById("perfilBox");
      if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
        mostrarPerfil();
      } else {
        box.style.display = "none";
      }
    }

    function cerrarSesion() {
      localStorage.removeItem("usuarioActual");
      document.getElementById("perfilBox").style.display = "none";
    }

    window.onload = function() {
      renderUsuarios();
      mostrarPerfil();
    };






