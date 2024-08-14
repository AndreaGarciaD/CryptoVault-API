const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");
const { stringToSah1 } = require('../utils/crypto.utils');

exports.listUsuarios = async (req, res) => {
    const usuarios = await db.usuarios.findAll();
    res.send(usuarios);
}

exports.createUsuario = async (req, res) => {
    const requiredFields = ["nombre", "correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0){
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const encryptedPassword = stringToSah1(req.body.password);

    try {
        const usuario = await db.usuarios.create({
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            password: encryptedPassword
        });

        res.status(201).send(usuario);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);

    if (!usuario){
        res.status(404).send({ message: `No se encontro el usuario` });
        return;
    }

    await usuario.update(req.body);
    res.send(usuario);
};

exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);

    if (!usuario){
        res.status(404).send({ message: `No se encontro el usuario` });
        return;
    }

    await usuario.destroy();
    res.send({ message: `El usuario fue eliminado` });
};

exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    const usuario = await db.usuarios.findByPk(id);

    if (!usuario){
        res.status(404).send({ message: `No se encontro el usuario` });
        return;
    }

    res.send(usuario);
}

