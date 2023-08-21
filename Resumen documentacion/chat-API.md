# Pasos para configurar un cliente Js
## 1. Configurar conexión del cliente
```
const client = StreamChat.getInstance("dz5f4d5kzrue");
await client.connectUser({
  id: "small-tooth-3",
  name: "small", // Nombre del cliente
  image: "https://bit.ly/2u9Vc0r",
}, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic21hbGwtdG9vdGgtMyIsImV4cCI6MTY5MjQxMjk5MH0.AuVYTB0qtmFR-yKAJVCCsaLPeoNbKp-ievsBvidNN8Y"); // token generado por el servidor
return client;
```
## 2. Crear un canal

```
const channel = client.channel(
    'messaging', // tipo de canal
    'the-small-council_hRVpWpeImu', // id de conversación
    {   // data
        name: "Private Chat About the Kingdom",
        image: "https://bit.ly/2F3KEoM",
        members: ["small-tooth-3"],
        session: 8 // custom field, you can add as many as you want
});

await channel.watch();

return channel;
```
## 3. Enviar mensajes
### 1. Enviar mensaje simple
```
const message = await channel.sendMessage({
  text: "Did you already see the trailer? https://www.youtube.com/watch?v=wA38GCX4Tb0",
});

return message;
```
### 2. Reacción a un mensaje
```
const messageId = "d5d7994a-dca0-4cfb-9ad3-6e70a79dd303";

const reaction = await channel.sendReaction(messageId, {
  type: "love"
});

return reaction;
```
### 3. Crear un hilo a partir de un mensaje
```
const parent = await channel.sendMessage({
  text: 'Episode 1 just blew my mind!',
});

const reply = await channel.sendMessage({
  text: "Stop it, no spoilers please!",
  parent_id: parent.message.id,
  customField: 123, // custom field, you can add as many as you want
});
```
### 4. Interceptar eventos
En el siguiente código se establece una escucha para el evento message.new, de manera que al capturar dicho evento genere el log correspondiente. 
```
channel.on("message.new", event => {
  logEvent(event);
});

await channel.sendMessage({
  text: "What is the medieval equivalent of tabs vs spaces?",
});
```
Al obtener este evento se genera el siguiente log:
```
{
  "type": "message.new",
  "cid": "messaging:the-small-council_hRVpWpeImu",
  "channel_id": "the-small-council_hRVpWpeImu",
  "channel_type": "messaging",
  "message": {
    "id": "4d437ab6-940a-4d8a-8882-778af24dd00e",
    "text": "what is the medieval equivalent of tabs vs spaces?",
    "html": "<p>what is the medieval equivalent of tabs vs spaces?</p>\n",
    "type": "regular",
    "user": {
      "id": "small-tooth-3",
      "role": "user",
      "created_at": "2021-11-02T12:35:36.288354Z",
      "updated_at": "2023-08-18T21:44:09.000843Z",
      "last_active": "2023-08-18T22:15:50.628694517Z",
      "banned": false,
      "online": true,
      "name": "small",
      "image": "https://bit.ly/2u9Vc0r"
    },
    "attachments": [],
    "latest_reactions": [],
    "own_reactions": [],
    "reaction_counts": {},
    "reaction_scores": {},
    "reply_count": 0,
    "cid": "messaging:the-small-council_hRVpWpeImu",
    "created_at": "2023-08-18T22:16:09.338777Z",
    "updated_at": "2023-08-18T22:16:09.338777Z",
    "shadowed": false,
    "mentioned_users": [],
    "silent": false,
    "pinned": false,
    "pinned_at": null,
    "pinned_by": null,
    "pin_expires": null
  },
  "user": {
    "id": "small-tooth-3",
    "role": "user",
    "created_at": "2021-11-02T12:35:36.288354Z",
    "updated_at": "2023-08-18T21:44:09.000843Z",
    "last_active": "2023-08-18T22:15:50.628694517Z",
    "banned": false,
    "online": true,
    "name": "small",
    "image": "https://bit.ly/2u9Vc0r"
  },
  "watcher_count": 1,
  "created_at": "2023-08-18T22:16:09.346419979Z",
  "received_at": "2023-08-18T22:16:02.890Z"
}
```

