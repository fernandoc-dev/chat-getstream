# Implementación backend de getstream.io 
- [Implementación backend de getstream.io](#implementación-backend-de-getstreamio)
  - [Generar tokens de usuarios](#generar-tokens-de-usuarios)
  - [Sincronización de usuarios](#sincronización-de-usuarios)
  - [Sincronizar canales](#sincronizar-canales)
  - [Añadir y quitar miembros al canal](#añadir-y-quitar-miembros-al-canal)
  - [Enviar mensajes desde el backend](#enviar-mensajes-desde-el-backend)


## Generar tokens de usuarios
Instalar la librería stream-chat:
`pip install stream-chat`

Intrucciones Python:
```
from stream_chat import StreamChat

# instantiate your stream client using the API key and secret
# the secret is only used server side and gives you full access to the API
server_client = StreamChat(
    api_key="kxc27se4yn2e",
    api_secret="tgthbjgsu7wnu4sec667qex6pxqak38wmka999raywk5j44b6bkphatxmrdz6m8z")
    
token = server_client.create_token("john")

# next, hand this token to the client in your in your login or registration response
```
## Sincronización de usuarios
Para sincronizar usuarios (se pueden agregar hasta 100 usuarios a la vez) se ejecuta el siguiente código Python:
```
server_client.upsert_user({"id": user_id, "role": "admin", "mycustomfield": "123"})
```
## Sincronizar canales
Con el siguiente código Python se crean y actualizan canales:
```
channel = server_client.channel("messaging", "kung-fu")
channel.create(user_id)
channel.update({"name": "my channel", "image": "image url", "mycustomfield": "123"})

```
## Añadir y quitar miembros al canal
```
channel.add_members(["thierry", "josh", "tommaso"])
channel.remove_members(["tommaso"])

channel.add_moderators(["thierry"])
channel.demote_moderators(["thierry"])
```
## Enviar mensajes desde el backend
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

channel.send_message(message, "thierry")
```


