# api/socket_handlers.py

from flask import session
from flask_socketio import join_room, disconnect
from flask_jwt_extended import decode_token
from api.socketio_instance import socketio


@socketio.on("connect")
def handle_connect(auth):
    try:
        token = auth.get("token") if auth else None
        if not token:
            return False

        decoded = decode_token(token)
        user_id = int(decoded["sub"])

        session["uid"] = user_id

        # Room privada fija por usuario
        join_room(f"user_{user_id}")

        return True

    except Exception as e:
        print("Socket connect error:", e)      
        return False


@socketio.on("disconnect")
def handle_disconnect():
    user_id = session.get("uid")
    if user_id:
        print(f"User {user_id} disconnected")