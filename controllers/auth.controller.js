const { checkRequiredFields } = require("../utils/request.utils");
const db = require("../models");
const { generarTokenUsuario } = require("../utils/code.utils");
const { stringToSah1 } = require('../utils/crypto.utils');

exports.generateUserToken = async (req, res) => {
    const requiredFields = ["correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }

    const { correo, password } = req.body;
    const hashedPassword = stringToSah1(password);

    console.log("Correo", correo);

    // Buscar en la tabla de usuarios
    let usuario = await db.usuarios.findOne({
        where: {
            correo,
            password: hashedPassword
        }
    });

    let rol = 1;
    let isAdmin = false;

    if (!usuario) {
        console.log("No es usuario, buscar en admins");
        usuario = await db.admins.findOne({
            where: {
                correo,
                password: hashedPassword
            }
        });
        rol = 2;
        isAdmin = true;
    }

    console.log("Usuario", usuario);

    if (!usuario) {
        console.log("Usuario no encontrado");
        res.status(401).send({ message: "Usuario o contraseña incorrectos" });
        return;
    }

    const token = generarTokenUsuario();

    if (isAdmin) {
        await db.tokens.create({
            token,
            admin_id: usuario.id,
            rol
        });
    } else {
        await db.tokens.create({
            token,
            usuario_id: usuario.id,
            rol
        });
    }

    res.send({ token, rol });
};



exports.registerUser = async (req, res) => {
    const requiredFields = ["nombre", "telefono", "correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message:
                `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    const { nombre, correo, telefono, password } = req.body;
    const usuarioDB = await db.usuarios.findOne({
        where: {
            correo
        }
    });
    if (usuarioDB) {
        res.status(400).send({
            message: "El email ya está registrado"
        });
        return;
    }
    const usuario = await db.usuarios.create({
        nombre,
        correo,
        telefono,
        password: stringToSah1(password)
    });
    usuario.password = undefined;
    res.send(usuario);
}

exports.me = async (req, res) => {
    console.log("Usuario actual", res.locals.user)
    const usuario = await db.usuarios.findOne({
        where: {
            id: res.locals.user.id
        }
    });
    res.send(usuario);
}

exports.AdminMe = async (req, res) => {
    console.log("Usuario actual", res.locals.user)
    const usuario = await db.admins.findOne({
        where: {
            id: res.locals.user.id
        }
    });
    res.send(usuario);
}