"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import eventlet
eventlet.monkey_patch()

import api.socket_handlers
from api.socketio_instance import socketio
from api.commands import setup_commands
from api.admin import setup_admin
from api.routes import api
from api.models import db
from api.utils import APIException, generate_sitemap
from flask_jwt_extended import JWTManager
from flask_swagger import swagger
from flask_cors import CORS
from flask_migrate import Migrate
from flask import Flask, request, jsonify, url_for, send_from_directory
import os

# import eventlet
# eventlet.monkey_patch()


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
jwt = JWTManager(app)

CORS(app, origins=[
    "https://trasteando-marketplace.vercel.app",
    "https://trasteando-marketplace-git-main-sergioc246s-projects.vercel.app",
    "http://localhost:3000"
])

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix

socketio.init_app(app, cors_allowed_origins="*")


app.register_blueprint(api, url_prefix='/api')


# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    # if ENV == "development":
    #     return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')


# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


# with app.app_context():
#     db.create_all()
#     print("Tablas creadas (si no existían)")


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    socketio.run(app, host='0.0.0.0', port=PORT,
                 debug=True)
                #  , allow_unsafe_werkzeug=True)
