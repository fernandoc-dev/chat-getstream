from stream_chat import StreamChat

chat = StreamChat(api_key="STREAM_KEY", api_secret="STREAM_SECRET")

# add a user
chat.upsert_user({"id": "chuck", "name": "Chuck"})

# create a channel about kung-fu
channel = chat.channel("messaging", "kung-fu")
channel.create("chuck")

# add a first message to the channel
channel.send_message({"text": "AMA about kung-fu"}, "chuck")

# we also expose some response metadata through a custom dictionary
resp = chat.deactivate_user("bruce_lee")

print(type(resp)) # <class 'stream_chat.types.stream_response.StreamResponse'>
print(resp["user"]["id"]) # bruce_lee

rate_limit = resp.rate_limit()
print(f"{rate_limit.limit} / {rate_limit.remaining} / {rate_limit.reset}") # 60 / 59 /2022-01-06 12:35:00+00:00

headers = resp.headers()
print(headers) # { 'Content-Encoding': 'gzip', 'Content-Length': '33', ... }

status_code = resp.status_code()
print(status_code) # 200
