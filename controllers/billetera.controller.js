const db = require("../models");
const { generarCodigo } = require("../utils/code.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listBilleteras = async (req, res) => {
    const billeteras = await db.billeteras.findAll();
    res.send(billeteras);
}

exports.createBilletera = async (req, res) => {
    const requiredFields = ["moneda_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { moneda_id } = req.body;
    const usuario_id = res.locals.user.id;

    try {
        const existingBilletera = await db.billeteras.findOne({
            where: {
                usuario_id,
                moneda_id,
            },
        });

        if (existingBilletera) {
            res.status(400).send({ message: "Ya existe una billetera para esta moneda." });
            return;
        }

        const codigo = generarCodigo();

        const billetera = await db.billeteras.create({
            usuario_id,
            moneda_id,
            saldo: 0,
            codigo,
        });

        res.status(201).send(billetera);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateBilletera = async (req, res) => {
    const id = req.params.id;
    const billetera = await db.billeteras.findByPk(id);

    if (!billetera){
        res.status(404).send({ message: `No se encontro la billetera` });
        return;
    }

    await billetera.update(req.body);
    res.send(billetera);
};

exports.deleteBilletera = async (req, res) => {
    const id = req.params.id;
    const billetera = await db.billeteras.findByPk(id);

    if (!billetera){
        res.status(404).send({ message: `No se encontro la billetera` });
        return;
    }

    await billetera.destroy();
    res.send({ message: `La billetera fue eliminada` });
};

exports.getBilleteraById = async (req, res) => {
    const id = req.params.id;
    const billetera = await db.billeteras.findByPk(id, {
        include: [
            "usuario",
            "moneda"
        ]
    });

    if (!billetera){
        res.status(404).send({ message: `No se encontro la billetera` });
        return;
    }

    res.send(billetera);
}

exports.getBilleterasPorUsuario = async (req, res) => {
    const id = req.params.id;
    const billeteras = await db.billeteras.findAll({
        where: {
            usuario_id: id,
        },
        include: [
            "usuario",
            "moneda"
        ]
    });

    res.send(billeteras);
}

exports.depositarEnBilleteraId = async (req, res) => {
    const id = req.params.id;
    const requiredFields = ["monto"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { monto } = req.body;

    try {
        const billetera = await db.billeteras.findByPk(id, {
            include: ["moneda"]
        });

        if (!billetera) {
            res.status(404).send({ message: `No se encontró la billetera` });
            return;
        }

        const moneda = billetera.moneda;

        if (!moneda) {
            res.status(404).send({ message: `No se encontró la moneda asociada a la billetera` });
            return;
        }

        const valorUsd = moneda.valorUsd;
        const montoConvertido = parseFloat(monto) / valorUsd;

        const nuevoSaldo = parseFloat(billetera.saldo) + montoConvertido;
        billetera.saldo = nuevoSaldo;
        await billetera.save();

        const movimiento = await db.movimientos.create({
            descripcion: `Depósito de ${monto} USD `,
            billetera_id: id,
            montoMoneda: montoConvertido,
            tipo: 1,
            movimientoReferencia: null
        });

        res.status(201).send({ billetera, movimiento });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.transferirDesdeBilleteraId = async (req, res) => {
    const { id } = req.params; // id billetera de origen
    const requiredFields = ["beneficiarioId", "monto"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { beneficiarioId, monto } = req.body;

    try {
        const billeteraOrigen = await db.billeteras.findOne({ where: { id } });
        if (!billeteraOrigen) {
            return res.status(400).send({ message: "La billetera de origen no existe." });
        }
console.log("beneficiario", beneficiarioId)
        const beneficiario = await db.beneficiarios.findOne({ where: { id: beneficiarioId.id } });
        if (!beneficiario) {
            return res.status(400).send({ message: "El beneficiario no existe." });
        }

        const billeteraDestino = await db.billeteras.findOne({ where: { codigo: beneficiario.codigo_billetera } });
        if (!billeteraDestino) {
            return res.status(400).send({ message: "La billetera de destino no existe." });
        }

        console.log(billeteraDestino);

        const monedaOrigen = await db.monedas.findOne({ where: { id: billeteraOrigen.moneda_id } });
        const monedaDestino = await db.monedas.findOne({ where: { id: billeteraDestino.moneda_id } });

        if (!monedaOrigen || !monedaDestino) {
            return res.status(400).send({ message: "Una de las monedas no existe." });
        }

        const montoUSD = monto * monedaOrigen.valorUsd;


        const montoDestino = montoUSD / monedaDestino.valorUsd;

        const movimientoEgreso = await db.movimientos.create({
            descripcion: `Transferencia a beneficiario ${beneficiario.nombre_referencia}`,
            billetera_id: billeteraOrigen.id,
            montoMoneda: monto,
            tipo: 2,
            movimientoReferencia: null
        });

        const movimientoIngreso = await db.movimientos.create({
            descripcion: `Transferencia desde billetera ${billeteraOrigen.codigo}`,
            billetera_id: billeteraDestino.id,
            montoMoneda: montoDestino,
            tipo: 1,
            movimientoReferencia: movimientoEgreso.id
        });

        await db.movimientos.update(
            { movimientoReferencia: movimientoIngreso.id },
            { where: { id: movimientoEgreso.id } }
        );

        console.log("saldo antiguo", billeteraDestino.saldo);
        console.log("monto destino", montoDestino);

        billeteraOrigen.saldo = parseFloat(billeteraOrigen.saldo) - parseFloat(monto);
        billeteraDestino.saldo = parseFloat(billeteraDestino.saldo) + parseFloat(montoDestino);

        console.log("nuevo saldo", billeteraDestino.saldo);

        await billeteraOrigen.save();
        await billeteraDestino.save();

        console.log("saldo nuevo", billeteraDestino.saldo);

        res.status(201).send({ mensaje: "Transferencia realizada con éxito", movimientoIngreso, movimientoEgreso });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};







