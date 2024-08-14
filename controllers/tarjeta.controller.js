const db = require("../models");
const { luhnCheck } = require("../utils/code.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listTarjetas = async (req, res) => {
    const tarjetas = await db.tarjetas.findAll();
    res.send(tarjetas);
}

exports.createTarjeta = async (req, res) => {
    const requiredFields = ["nombre", "numero", "cvv", "fechVencimiento"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { nombre, numero, cvv, fechVencimiento } = req.body;

    console.log(res.locals.user.id);

    if (!luhnCheck(numero)) {
        res.status(400).send({ message: "Número de tarjeta inválido" });
        return;
    }

    try {
        const tarjeta = await db.tarjetas.create({
            nombre,
            numero,
            cvv,
            fechVencimiento,
            usuario_id: res.locals.user.id,
        });

        console.log("Tarjeta creada", tarjeta);

        res.status(201).send(tarjeta);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateTarjeta = async (req, res) => {
    const id = req.params.id;
    const tarjeta = await db.tarjetas.findByPk(id);

    if (!tarjeta){
        res.status(404).send({ message: `No se encontro la tarjeta` });
        return;
    }

    await tarjeta.update(req.body);
    res.send(tarjeta);
};

exports.deleteTarjeta = async (req, res) => {
    const id = req.params.id;
    const tarjeta = await db.tarjetas.findByPk(id);

    if (!tarjeta){
        res.status(404).send({ message: `No se encontro la tarjeta` });
        return;
    }

    await tarjeta.destroy();
    res.send({ message: `La tarjeta fue eliminada` });
};

exports.getTarjetaById = async (req, res) => {
    const id = req.params.id;
    const tarjeta = await db.tarjetas.findByPk(id, {
        include: [
            "usuario"
        ]
    });

    if (!tarjeta){
        res.status(404).send({ message: `No se encontro la tarjeta` });
        return;
    }

    res.send(tarjeta);
}

exports.getTarjetasPorUsuario = async (req, res) => {
    const id = req.params.id;
    const tarjetas = await db.tarjetas.findAll({
        where: {
            usuario_id: id,
        },
        include: [
            "usuario"
        ]
    });

    res.send(tarjetas);
}

