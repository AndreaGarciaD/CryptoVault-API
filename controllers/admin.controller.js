const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");
const { stringToSah1 } = require('../utils/crypto.utils');

exports.listAdmin = async (req, res) => {
    const admins = await db.admins.findAll();
    res.send(admins);
}

exports.createAdmin = async (req, res) => {
    const requiredFields = ["nombre", "correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0){
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const encryptedPassword = stringToSah1(req.body.password);

    try {
        const admin = await db.admins.create({
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            password: encryptedPassword
        });

        res.status(201).send(admin);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateAdmin = async (req, res) => {
    const id = req.params.id;
    const admin = await db.admins.findByPk(id);

    if (!admin){
        res.status(404).send({ message: `No se encontro el admin` });
        return;
    }

    await admin.update(req.body);
    res.send(admin);
};

exports.deleteAdmin = async (req, res) => {
    const id = req.params.id;
    const admin = await db.admins.findByPk(id);

    if (!admin){
        res.status(404).send({ message: `No se encontro el admin` });
        return;
    }

    await admin.destroy();
    res.send({ message: `El admin fue eliminado` });
};
