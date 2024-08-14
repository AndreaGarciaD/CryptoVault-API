const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listMonedas = async (req, res) => {
    const monedas = await db.monedas.findAll();
    res.send(monedas);
}

exports.createMoneda = async (req, res) => {
    const requiredFields = ["nombre", "valorUsd"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0){
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    try {
        const moneda = await db.monedas.create({
            nombre: req.body.nombre,
            valorUsd: req.body.valorUsd
        });

        res.status(201).send(moneda);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateMoneda = async (req, res) => {
    const id = req.params.id;
    const moneda = await db.monedas.findByPk(id);

    if (!moneda){
        res.status(404).send({ message: `No se encontro la moneda` });
        return;
    }

    await moneda.update(req.body);
    res.send(moneda);
};

exports.deleteMoneda = async (req, res) => {
    const id = req.params.id;
    const moneda = await db.monedas.findByPk(id);

    if (!moneda){
        res.status(404).send({ message: `No se encontro la moneda` });
        return;
    }

    await moneda.destroy();
    res.send({ message: `La moneda fue eliminada` });
};

exports.getMonedaById = async (req, res) => {
    const id = req.params.id;
    const moneda = await db.monedas.findByPk(id);

    if (!moneda){
        res.status(404).send({ message: `No se encontro la moneda` });
        return;
    }

    res.send(moneda);
}

