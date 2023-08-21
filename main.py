from fastapi import FastAPI
from fastapi.responses import FileResponse
from stream_chat import StreamChat
import os
import random

app = FastAPI()

# Credenciales de GetStream
api_key = 'kxc27se4yn2e'
api_secret = 'tgthbjgsu7wnu4sec667qex6pxqak38wmka999raywk5j44b6bkphatxmrdz6m8z'

client = StreamChat(api_key, api_secret)

contacts = []

@app.get("/")
def read_root():
    return FileResponse(os.path.join("static", "index.html"))

# Ruta para servir archivos estáticos (como archivos JavaScript, CSS, imágenes) desde la carpeta "static".
# Por ejemplo, si hay una petición a "/static/scripts.js", servirá el archivo "scripts.js" que se encuentra en la carpeta "static".
@app.get("/static/{file_path:path}")
def read_static(file_path: str):
    return FileResponse(os.path.join("static", file_path))


@app.get("/generate_user")
def generate_user():
    user_id = f"usuario{random.randint(1, 1000)}"   # Genera un user_id único
    token = client.create_token(user_id)
    contacts.append({"user_id": user_id, "token": token})   # Guarda el usuario en la lista de contactos
    return {"user_id": user_id, "token": token}

@app.get("/contacts/{user_id}") # Enviar lista de contactos
def get_contacts(user_id: str):
    return {"contacts": [u["user_id"] for u in contacts if u["user_id"] != user_id]}

@app.get("/retrieve_token/{user_id}")
def retrieve_token(user_id: str):
    for contact in contacts:
        if contact["user_id"] == user_id:
            return {"token": contact["token"]}
    return {"error": "User not found"}, 404




if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', reload=True)