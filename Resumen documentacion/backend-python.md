# Implementación backend del chat getstream.io
La implementación del chat GetStream a nivel de backend se puede resumir en los siguientes pasos:

1. Instanciar la clase StreamChat
2. Generar los tokens de usuarios
3. Crear y gestionar usuarios
4. Crear y gestionar los canales
5. Establecer las configuraciones deseadas

Este manual desarrolla las tareas mencionadas de una forma organizada y resumida, y está basado en la documentación oficial de Python de getstream.io la cual se puede encontrar en [aquí](https://getstream.io/chat/docs/python/ "Documentación oficial Python").

El objeto de este manual es explicar en forma sencilla y en español los principales aspectos de la documentación oficial, en una lectura de 10 minutos, mientras que el tiempo de lectura de la documentación es de varias horas. 
- [Implementación backend del chat getstream.io](#implementación-backend-del-chat-getstreamio)
  - [Instanciar la clase StreamChat](#instanciar-la-clase-streamchat)
  - [Generar tokens de usuarios](#generar-tokens-de-usuarios)
  - [Sincronización de usuarios](#sincronización-de-usuarios)
    - [Respecto al Frontend](#respecto-al-frontend)
      - [Crear usuario](#crear-usuario)
      - [Cerrar sesión](#cerrar-sesión)
    - [Respecto al backend](#respecto-al-backend)
      - [Crear usuarios](#crear-usuarios)
      - [Desactivar usuarios](#desactivar-usuarios)
      - [Reactivar usuarios](#reactivar-usuarios)
      - [Eliminar usuarios](#eliminar-usuarios)
      - [Restaurar usuarios](#restaurar-usuarios)
  - [Sincronizar canales](#sincronizar-canales)
    - [Sobre el Tipo de canal](#sobre-el-tipo-de-canal)
      - [Crear Tipo de canal](#crear-tipo-de-canal)
      - [Eliminar Tipo de canal](#eliminar-tipo-de-canal)
    - [Sobre el canal](#sobre-el-canal)
      - [Crear el canal](#crear-el-canal)
        - [Crear canales de conversación "1 a 1"](#crear-canales-de-conversación-1-a-1)
        - [Crear canales de conversación "1 a muchos"](#crear-canales-de-conversación-1-a-muchos)
    - [Añadir y quitar miembros al canal](#añadir-y-quitar-miembros-al-canal)
  - [Mensajes](#mensajes)
    - [Enviar mensajes desde el backend](#enviar-mensajes-desde-el-backend)
    - [Recuperar un mensaje](#recuperar-un-mensaje)
    - [Delete a message](#delete-a-message)
  - [Configuraciones de la aplicación](#configuraciones-de-la-aplicación)
    - [Configuración de subida de imágenes](#configuración-de-subida-de-imágenes)
    - [Configuración de subida de archivos](#configuración-de-subida-de-archivos)

## Instanciar la clase StreamChat
Instalar la librería stream-chat:
`pip install stream-chat`

El primer paso es instanciar la clase StreamChat en el servidor:
```
from stream_chat import StreamChat

# Crea la instancia de la clase StreamChat

api_key="API-KEY"
api_secret="API-SECRET"

server_client = StreamChat(api_key, api_secret)
```
Nota: El API-SECRET sólo debe ser manejado en el backend.
## Generar tokens de usuarios

El token es la credencial de autenticación del usuario para conectarse a la API de GetStream.

El token debe ser generado en el backend de la siguiente manera:
```
# Genera el token del usuario
token = server_client.create_token("john")
```
Por defecto el token no caduca. En caso de desear establecer un token con fecha de caducidad:
```
# Crea un token valido por 1 hora
token = chat_client.create_token(
    'john',
    exp=datetime.datetime.utcnow() + datetime.timedelta(hours=1)
)
```
Sin embargo en caso de que la aplicación ya maneje sólo usuarios autenticados, se podría saltar el paso de la generación de token y generar el token directamente en el cliente de la siguiente manera (código Javascript):
```
await client.connectUser(
    {
        id: 'john',
        name: 'John Doe',
        image: 'https://getstream.io/random_svg/?name=John',
    },
   client.devToken('john'),
);
```
Para permiitir esto también se deberá configurar en el backend:
```
# Desactivar chequeo de autenticación
client.update_app_settings(disable_auth_checks=True)
```
Nota: Este método no es recomendado para entorno de producción por motivos de seguridad.
## Sincronización de usuarios
Tenemos la posibilidad de crear usuarios desde el frontend (con el método connectUser) y desde el backend (con el método upsert_users). 

Los usuarios son registrados con la siguiente estructura:
```
{
    "id" : UserID,
    "role" : "user" / "admin"
    "otro_campo" : "otro valor"
}
```
Sin embargo, los usuarios administradores solo podrán ser registrados desde el backend. 
### Respecto al Frontend
#### Crear usuario
Los usuarios son iniciados del lado del cliente, siempre que tengan el token correspondiente (código Javascript):
```
import { StreamChat } from 'stream-chat';

// Para inicializar el usuario necesita API Key
const chatClient = StreamChat.getInstance('YOUR_API_KEY', {
    timeout: 6000,
});

// Para conectar (registrar y/o iniciar sesión) el usaurio necesita el token de usuario
await chatClient.connectUser(
    {
        id: 'john',
        name: 'John Doe',
        image: 'https://getstream.io/random_svg/?name=John',
    },
    'CHAT_USER_TOKEN',
);
```
#### Cerrar sesión
```
await client.disconnectUser();
```
### Respecto al backend
#### Crear usuarios
Para crear usuarios (se pueden agregar hasta 100 usuarios a la vez) se ejecuta el siguiente código Python:
```
client.upsert_users([
  {"id": user_id1, "role": "admin", "book": "dune"},
  {"id": user_id2, "role": "user", "book": "1984"},
  {"id": user_id3, "role": "admin", "book": "Fahrenheit 451"},
])
```
#### Desactivar usuarios
```
response = client.deactivate_user(user_id)
```
#### Reactivar usuarios
```
response = client.reactivate_user(user_id)
```
#### Eliminar usuarios
Para eliminar un usuario:
```
response = client.delete_user(user_id)
```
Para eliminar multiples usuarios:
```
response = client.delete_users(
    ['userID1', 'userID2'], 
    "soft", 
    messages="hard"
)

response = client.get_task(response["task_id"])

if response['status'] == 'completed':
    # success!
    pass
```
#### Restaurar usuarios
```
client.restore_users(﻿[﻿'userID1'﻿, 'userID2']﻿)
```
## Sincronizar canales
Existen por defecto 5 tipos de canales:
- Livestream (se asemeja al chat de YouTube o Twitch)
- Messaging (se asemeja a WhatsApp o Facebook Messenger)
- Team (se asemeja al chat de Slack)
- Commerce (se asemeja al chat de Intercom o Drift)
- Gaming (se asemeja a chats de videojuegos)

Cada tipo de canal se caracteriza por cómo dispone (o no) de las siguientes caracteristicas:
- typing_events: Controla si se muestran los indicadores de tipeo.
- read_events: controla si el chat muestra cuánto has leído.
- connect_events: determina si se activan eventos para conectarse y desconectarse de un chat.
- search: Controla si los mensajes deben ser buscables.
- reactions: si los usuarios pueden agregar reacciones a los mensajes.
- replies: Habilita hilos de mensajes y respuestas.
- mute: determina si los usuarios pueden silenciar a otros usuarios.
- push_notifications: si se permite que los mensajes generen notificaciones push.
- uploads: permite cargar imágenes y archivos dentro de los mensajes.
- url_enrichment: cuando está habilitado, los mensajes que contienen URL se enriquecerán automáticamente con imágenes y texto relacionados con el mensaje.

### Sobre el Tipo de canal
#### Crear Tipo de canal
```
client.create_channel_type(
    {
        "name": "public",
        "mutes": False,
        "reactions": False,
    }
)
```
#### Eliminar Tipo de canal
```
client.delete_channel_type("public")
```
### Sobre el canal
#### Crear el canal
Según el propósito que cumpla el canal, habrá una manera particular de crearlo.

##### Crear canales de conversación "1 a 1"
```
channel = Channel("messaging", None, custom_data=dict(members=["thierry"]))
# Note: query method creates a channel
channel.query()
```
##### Crear canales de conversación "1 a muchos"
```
channel = Channel("messaging", "general")
channel.create("<user-id>")
```
### Añadir y quitar miembros al canal
```
channel.add_members(["thierry", "josh", "tommaso"])
channel.remove_members(["tommaso"])

channel.add_moderators(["thierry"])
channel.demote_moderators(["thierry"])
```








Con el siguiente código Python se crean y actualizan canales:
```
channel = server_client.channel("messaging", "kung-fu")
channel.create(user_id)
channel.update({"name": "my channel", "image": "image url", "mycustomfield": "123"})
```
## Mensajes
### Enviar mensajes desde el backend
```
message = {
    "text": "@Josh I told them I was pesca-pescatarian. Which is one who eats solely fish who eat other fish.",
    "attachments": [
        {
            "type": "image",
            "asset_url": "https://bit.ly/2K74TaG",
            "thumb_url": "https://bit.ly/2Uumxti",
            "myCustomField": 123,
        }
    ],
    "mentioned_users": [josh["id"]],
    "anotherCustomField": 234,
}

channel.send_message(message, user_id) # UserID: Quien envía el mensaje
```
Al enviar mensajes desde el frontend se agrega automáticamente el user_id con el identificador del cliente que envía el mensaje.
### Recuperar un mensaje
```
response = client.get_message(msg_id)
```
### Delete a message
```
# soft delete a message
client.delete_message(msg_id)

# hard delete a message
client.delete_message(msg_id, hard=True)
``` 
## Configuraciones de la aplicación
### Configuración de subida de imágenes
```
# Solo acepta archivos gif, jpeg, o png
client.update_app_settings({
    "image_upload_config": {
      "allowed_file_extensions": [".gif", ".jpeg", ".png"],
      "allowed_mime_types": ["image/gif", "image/jpeg", "image/png"],
}})
```
### Configuración de subida de archivos
```
# Solo acepta archivos .CSV

client.update_app_settings({
    "file_upload_config": {
      "allowed_file_extensions": [".csv"],
      "allowed_mime_types": ["text/csv"],
      "blocked_file_extensions": [".exe,"],
}})
```


