from flask import Flask, request, jsonify

usuarios = [
    { "nombre": "Juan", "bandeja_de_entrada": [] },
    { "nombre": "Ana", "bandeja_de_entrada": [] },
    { "nombre": "Jose", "bandeja_de_entrada": [] },
    { "nombre": "Diego", "bandeja_de_entrada": [] },
    { "nombre": "Andrea", "bandeja_de_entrada": [] },
]

app = Flask(__name__)

@app.route("/autentificacion", methods=["POST"])
def autentificar_usuario ():
    informacion = request.get_json()

    usuario = informacion.usuario

    if usuario == " ": return jsonify({"respuesta": "El nombre no puede estar vacio", "error": True}), 400

    respuesta = {"mensaje": "No se encontro al usuario en la base de datos", "error": True}
    status_code = 404

    for usuarios_verificados in usuario:
        if usuarios_verificados["nombre"] == usuarios:
            respuesta = {"respuesta": "El usuario existe en la base de datos :)", "error": False}
            status_code = 200
            break

    return jsonify(respuesta), status_code

@app.route("/agregar_mensajes", methods=["POST"])
def procesar_mensajes():
    datos = request.get_json()

    origen, destino, mensaje = datos.origen, datos.destino, datos.mensaje

    #vefirica si ningun dato esta vacio, para procesarlo
    if(origen and destino and mensaje):
        respuesta = {"mensaje": f"No se encontro al usuario {destino}", "error": True}
        status_code = 404

        for usuario in usuarios:
            if usuario["nombre"] == destino: 
                usuario["bandeja_de_entrada"].append({"origen": origen, "mensaje": mensaje})
                respuesta = {"respuesta": "Se envio correctamente el mensaje", "error": False}
                status_code = 200
                break
        
        return jsonify(respuesta), status_code

    #devuelve un error si algun dato esta vacio
    else: return jsonify({"mensaje": "Uno de los datos esta vacio, verifica y vuelve a enviar", "error": True}), 400

@app.route("/obtener_mensajes", methos=["GET"])
def devolver_mensajes():
    datos = request.get_json()

    usuario = datos.usuario

    for usuarios_verificados in usuarios:
        if usuarios_verificados["nombre"] == usuario:
            return jsonify({"respuesta": usuarios_verificados["bandeja_de_entrada"]}), 200

if __name__ == "__main__":
    app.run()
