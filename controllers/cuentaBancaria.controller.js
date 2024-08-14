const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listCuentas = async (req, res) => {
    const cuentas = await db.cuentas.findAll();
    res.send(cuentas);
}

exports.createCuenta = async (req, res) => {
    const requiredFields = ["numero_cuenta", "nombre", "documento_identificacion", "banco", "moneda_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { numero_cuenta, nombre, documento_identificacion, banco, moneda_id } = req.body;

    const minDigitsCuenta = 6;
    const minDigitsDocumento = 6;

    if (numero_cuenta.length < minDigitsCuenta || documento_identificacion.length < minDigitsDocumento) {
        res.status(400).send({
            message: `El número de cuenta debe tener al menos ${minDigitsCuenta} dígitos y el documento de identificación al menos ${minDigitsDocumento} dígitos.`
        });
        return;
    }

    try {
        const cuenta = await db.cuentas.create({
            numero_cuenta,
            nombre,
            documento_identificacion,
            banco,
            moneda_id,
            usuario_id: res.locals.user.id,
        });

        res.status(201).send(cuenta);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.updateCuenta = async (req, res) => {
    const id = req.params.id;
    const cuenta = await db.cuentas.findByPk(id);

    if (!cuenta){
        res.status(404).send({ message: `No se encontro la cuenta` });
        return;
    }

    await cuenta.update(req.body);
    res.send(cuenta);
};

exports.deleteCuenta = async (req, res) => {
    const id = req.params.id;
    const cuenta = await db.cuentas.findByPk(id);

    if (!cuenta){
        res.status(404).send({ message: `No se encontro la cuenta` });
        return;
    }

    await cuenta.destroy();
    res.send({ message: `La cuenta fue eliminada` });
};

exports.getCuentaById = async (req, res) => {
    const id = req.params.id;
    const cuenta = await db.cuentas.findByPk(id, {
        include: [
            "usuario"
        ]
    });

    if (!cuenta){
        res.status(404).send({ message: `No se encontro la cuenta` });
        return;
    }

    res.send(cuenta);
}

exports.getCuentasPorUsuario = async (req, res) => {
    const id = req.params.id;
    const cuentas = await db.cuentas.findAll({
        where: {
            usuario_id: id,
        },
        include: [
            "usuario"
        ]
    });

    res.send(cuentas);
}

exports.retiroParaCuentaId = async (req, res) => {
    const id = req.params.id; // ID de la billetera
    const requiredFields = ["monto", "cuenta_id"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { monto, cuenta_id } = req.body;

    try {
        const billetera = await db.billeteras.findByPk(id, {
            include: ["moneda"]
        });

        if (!billetera) {
            res.status(404).send({ message: `No se encontró la billetera` });
            return;
        }

        const cuenta = await db.cuentas.findByPk(cuenta_id, {
            include: ["moneda"]
        });

        if (!cuenta) {
            res.status(404).send({ message: `No se encontró la cuenta bancaria` });
            return;
        }

        const monedaBilletera = billetera.moneda;
        const monedaCuenta = cuenta.moneda;

        if (!monedaBilletera || !monedaCuenta) {
            res.status(404).send({ message: `No se encontró la moneda asociada a la billetera o a la cuenta bancaria` });
            return;
        }

        const valorUsdBilletera = monedaBilletera.valorUsd;
        const valorUsdCuenta = monedaCuenta.valorUsd;

        const montoEnUsd = monto * valorUsdCuenta;
        const montoConvertido = montoEnUsd / valorUsdBilletera;

        if (billetera.saldo < montoConvertido) {
            res.status(400).send({ message: `Saldo insuficiente en la billetera` });
            return;
        }

        // Actualizar el saldo de la billetera
        const nuevoSaldo = billetera.saldo -= montoConvertido;
        billetera.saldo = nuevoSaldo;
        await billetera.save();

        // Registrar el movimiento en la tabla de movimientos
        const movimiento = await db.movimientos.create({
            descripcion: `Retiro de ${monto} ${monedaCuenta.nombre}`,
            billetera_id: id,
            montoMoneda: montoConvertido,
            tipo: 2, // Egreso
            movimientoReferencia: null
        });

        res.status(201).send({ billetera, movimiento });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

