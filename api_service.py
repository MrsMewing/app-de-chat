from flask import Flask, request, jsonify
from flask_cors import CORS
usuarios = [
    { "nombre": "Juan", "bandeja_de_entrada": [] },
    { "nombre": "Ana", "bandeja_de_entrada": [] },
    { "nombre": "Jose", "bandeja_de_entrada": [] },
    { "nombre": "Diego", "bandeja_de_entrada": [] },
    { "nombre": "Andrea", "bandeja_de_entrada": [] },
]

app = Flask(__name__)
CORS(app)

@app.route("/autentificacion", methods=["POST"])
def autentificar_usuario ():
    informacion = request.get_json()

    usuario_nuevo = informacion["usuario"]

    if usuario_nuevo == " ": return jsonify({"respuesta": "El nombre no puede estar vacio", "error": True}), 400

    respuesta = {"mensaje": "No se encontro al usuario en la base de datos", "error": True}
    status_code = 404

    for usuarios_verificado in usuarios:
        if usuarios_verificado["nombre"] == usuario_nuevo:
            respuesta = {"respuesta": f"Estas verificado, bienvenido {usuario_nuevo}", "error": False}
            status_code = 200
            break

    return jsonify(respuesta), status_code

@app.route("/obtener_usuarios", methods=["GET"])
def devolver_usuarios():
    return jsonify({"respuesta": usuarios, "error": False}), 200

@app.route("/agregar_mensajes", methods=["POST"])
def procesar_mensajes():
    datos = request.get_json()

    origen_mensaje, destino_mensaje, contenido_mensaje = datos["origen"], datos["destino"], datos["mensaje"]

    respuesta = {"mensaje": f"No se encontro al usuario {destino_mensaje}", "error": True}
    status_code = 404

    for usuario in usuarios:
        if usuario["nombre"] == destino_mensaje: 
            usuario["bandeja_de_entrada"].append({"origen": origen_mensaje, "mensaje": contenido_mensaje})
            respuesta = {"respuesta": "Se envio correctamente el mensaje", "error": False}
            status_code = 200
            break
        
    return jsonify(respuesta), status_code

@app.route("/obtener_mensajes", methods=["GET"])
def devolver_mensajes():

    usuario = request.args.get("nombre_usuario")

    respuesta = {"respuesta": "No se encontro al usuario ", "error": True}
    status_code = 404

    print(usuario)
    for usuarios_verificado in usuarios:
        if usuarios_verificado["nombre"] == usuario:
            respuesta = {"respuesta": usuarios_verificado["bandeja_de_entrada"], "error": False}
            status_code = 200
            break

    return jsonify(respuesta), status_code

if __name__ == "__main__":
    app.run()
