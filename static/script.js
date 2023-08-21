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
  
  // Función para inicializar la página
  function initializePage(user, token) {
    client.setUser({id: user}, token);
  
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
  
  // Inicializar Stream Chat
  const client = new StreamChat('kxc27se4yn2e');
  
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
  
  // Función para abrir o continuar una conversación
  function openConversation(user, contact) {
    // Aquí debes implementar la lógica para abrir o continuar una conversación
  }
  
  // Función para enviar mensajes
  function sendMessage() {
    // Implementar lógica para enviar mensajes
  }
  