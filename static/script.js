// Función para obtener el valor de una cookie
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return "";
}

// Función para establecer una cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Función para agregar un mensaje a la lista de mensajes
function addMessage(message) {
  const messagesList = document.getElementById("messages-list");
  const messageItem = document.createElement("div");
  messageItem.innerText = `${message.user.id}: ${message.text}`;
  messagesList.appendChild(messageItem);
}

// Función para cargar la conversación
function loadConversation(channel) {
  // Agregar título
  const conversationTitle = document.getElementById("conversation-title");
  conversationTitle.innerHTML = `<h1>${channel.data.name}</h1>`;

  // Obtener y mostrar los mensajes
  channel.query().then(response => {
    const messagesList = document.getElementById("messages-list");
    messagesList.innerHTML = ''; // Limpiar la lista de mensajes antes de agregar los nuevos
    if (response.messages.length === 0) {
      messagesList.innerText = 'No hay mensajes';
    } else {
      response.messages.forEach(addMessage);
    }
  });
}

// Función para abrir o continuar una conversación
function openConversation(user1, user2) {
  // Crear o cargar el canal
  const channel = client.channel('messaging', `${user1}-${user2}`, {
    name: `Conversacion entre ${user1} y ${user2}`,
    members: [user1, user2],
  });

  // Establecer el canal actualmente activo
  currentChannel = channel;

  // Suscribirse a eventos de mensajes en este canal
  channel.on('message.new', event => {
    addMessage(event.message);
  });

  channel.create().then(() => {
    showConversation();
    loadConversation(channel);
  });
}

// Función para mostrar la conversación
function showConversation() {
  document.getElementById("chat-section").style.display = "none";
  document.getElementById("conversation").style.display = "block";
}

// Función para enviar mensajes
function sendMessage() {
  // Utiliza el canal actual para enviar el mensaje
  const input = document.getElementById("message-input");
  const message = input.value;

  if (currentChannel && message.trim() !== '') {
    currentChannel.sendMessage({ text: message }).then(() => {
      input.value = ''; // Limpiar el input
      loadConversation(currentChannel); // Actualizar la conversación
    });
  }
}

// Inicializar Stream Chat
const client = new StreamChat('kxc27se4yn2e');
let currentChannel; // Variable para almacenar el canal actual

// Verifica si hay una cookie con el ID del usuario
let user = getCookie("user_id");
if (!user) {
  fetch('/generate_user').then(response => response.json()).then(data => {
    user = data.user_id;
    const token = data.token;
    setCookie("user_id", user, 30); // Guardar el ID del usuario en una cookie por 30 días
    initializePage(user, token); // Llamada a la función de inicialización
  });
} else {
  fetch(`/retrieve_token/${user}`).then(response => response.json()).then(data => {
    const token = data.token;
    initializePage(user, token); // Llamada a la función de inicialización
  });
}

// Función para inicializar la página
function initializePage(user, token) {
  client.setUser({ id: user }, token);

  const userTitle = document.getElementById("user-title");
  userTitle.innerText = `ID del usuario: ${user}`; // Agregar título con ID de usuario

  // Obtener contactos y mostrarlos
  fetch(`/contacts/${user}`).then(response => response.json()).then(data => {
    const usersList = document.getElementById("users-list");

    if (data.contacts.length === 0) {
      usersList.innerText = 'No hay clientes para chatear.'; // Mensaje si no hay contactos
    } else {
      data.contacts.forEach(contact => {
        const contactLink = document.createElement("a");
        contactLink.href = `javascript:openConversation('${user}', '${contact}')`;
        contactLink.innerText = contact;
        usersList.appendChild(contactLink);
        usersList.appendChild(document.createElement("br"));
      });
    }
  });
}
