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


// historial de notificaciones 

const listaNotificaciones = document.getElementById('notificaciones');
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('sw.js')
    .then(reg => console.log('Service Worker registrado', reg))
    .catch(err => console.error('Error registrando SW:', err));

  // Escuchar mensajes del SW
  navigator.serviceWorker.addEventListener('message', event => {
    mostrarNotificacionEnLista(event.data);
  });
}

subscribeBtn.addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    alert('¡Notificaciones activadas!');
  } else {
    alert('No se activaron las notificaciones.');
  }
});

function mostrarNotificacionEnLista(data) {
  const div = document.createElement('div');
  div.className = 'notificacion';
  div.textContent = `${data.title}: ${data.body}`;
  listaNotificaciones.prepend(div); // Mostrar la más reciente arriba
}


self.addEventListener('push', event => {
  const data = event.data.json();

  // Mostrar la notificación en el sistema
  const promise = self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon.png'
  });

  // Mandar mensaje a la página para agregar a la lista
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(data);
    });
  });

  event.waitUntil(promise);
});

function mostrarNotificacionEnLista(data) {
  const listaNotificaciones = document.getElementById('notificaciones');
  const div = document.createElement('div');
  div.className = 'notificacion';
  div.textContent = `${data.title}: ${data.body}`;
  listaNotificaciones.prepend(div); // la más reciente arriba
}

console.log("Tu página funciona con XAMPP");






   
