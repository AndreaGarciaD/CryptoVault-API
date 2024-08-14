const db = require("../models");
const { generarCodigo } = require("../utils/code.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.createVentaPorBilleteraId = async (req, res) => {
    const id = req.params.id; // billetera id
    const requiredFields = ["valor_venta", "monto_moneda", "metodo_pago"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);

    if (fieldsWithErrors.length > 0) {
        res.status(400).send({ message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}` });
        return;
    }

    const { valor_venta, monto_moneda, metodo_pago } = req.body;

    console.log("venta", req.body);

    try {
        const billeteraOrigen = await db.billeteras.findOne({ where: { id } });
        if (!billeteraOrigen) {
            return res.status(400).send({ message: "La billetera de origen no existe." });
        }

        if (parseFloat(billeteraOrigen.saldo) < parseFloat(monto_moneda)) {
            return res.status(400).send({ message: "Saldo insuficiente en la billetera de origen." });
        }

        // Crear la venta
        const venta = await db.ventas.create({
            moneda_id: billeteraOrigen.moneda_id,
            valor_venta,
            monto_moneda,
            billetera_origen: id,
            metodo_pago,
            estado: "Pendiente",
            comprador_id: null
        });

        res.status(201).send(venta);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.deleteVenta = async (req, res) => {
    const id = req.params.id;
    const venta = await db.ventas.findByPk(id);

    if (!venta) {
        res.status(404).send({ message: `No se encontró la venta` });
        return;
    }

    if (venta.estado !== 'Pendiente') {
        res.status(400).send({ message: `La venta no puede ser eliminada porque su estado es ${venta.estado}` });
        return;
    }

    await venta.destroy();
    res.send({ message: `La venta fue eliminada` });
}

exports.getVentasPorBilletera = async (req, res) => {
    const id = req.params.id;
    const ventas = await db.ventas.findAll({
        where: {
            billetera_origen: id,
        },
        include: [
            "moneda"
        ]
    });

    res.send(ventas);
}

exports.getVentaById = async (req, res) => {
    const id = req.params.id;
    const venta = await db.ventas.findByPk(id, {
        include: [
            "moneda"
        ]
    });

    if (!venta) {
        res.status(404).send({ message: `No se encontro la venta` });
        return;
    }

    res.send(venta);
}

exports.getVentasPorUsuarioId = async (req, res) => {
    const id = req.params.id;
    const ventas = await db.ventas.findAll({
        include: [
            {
                model: db.billeteras,
                as: 'billetera',
                where: {
                    usuario_id: id
                }
            },
            {
                model: db.monedas,
                as: 'moneda'
            },
            {
                model: db.usuarios,
                as: 'comprador'
            }

        ]
    });

    res.send(ventas);
}

exports.getVentasDisponiblesPorUsuarioId = async (req, res) => {
    const { id } = req.params;

    try {
        const billeterasUsuario = await db.billeteras.findAll({ where: { usuario_id: id } });

        if (!billeterasUsuario || billeterasUsuario.length === 0) {
            return res.status(400).send({ message: "El usuario no tiene billeteras asociadas." });
        }

        const billeteraIdsUsuario = billeterasUsuario.map(billetera => billetera.id);

        const ventasDisponibles = await db.ventas.findAll({
            where: {
                billetera_origen: {
                    [db.Sequelize.Op.notIn]: billeteraIdsUsuario
                },
                estado: 'Pendiente'
            },
            include: [
                {
                    model: db.billeteras,
                    as: 'billetera',
                    include: [
                        {
                            model: db.usuarios,
                            as: 'usuario'
                        }
                    ]
                },
                {
                    model: db.monedas,
                    as: 'moneda'
                }
            ]
        });

        res.status(200).send(ventasDisponibles);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.postComprobantePago = async (req, res) => {
    const venta = await db.ventas.findByPk(req.params.id); //id venta
    const comprobante = req.files?.foto;

    console.log("comprobante", comprobante);

    if (!venta) {
        return res.status(404).send({ message: "No se encontró la venta" });
    }

    if (venta.estado !== 'Pendiente') {
        return res.status(400).send({ message: "La venta no se encuentra en estado pendiente" });
    }

    if (!comprobante) {
        return res.status(400).send({ message: "Debe enviar un comprobante de pago" });
    }

    const nombreArchivo = `${venta.id}.png`;
    // eslint-disable-next-line no-undef
    comprobante.mv(__dirname + `/../public/images/${nombreArchivo}`);
    res.send({ message: 'Comprobante subido correctamente' });
}

exports.postComprar = async (req, res) => {
    const { id } = req.params; // ID de la venta
    const { usuario_id } = req.body;

    if (!usuario_id) {
        return res.status(400).send({ message: "El ID del usuario es requerido." });
    }

    try {
        const venta = await db.ventas.findByPk(id);

        if (!venta) {
            return res.status(400).send({ message: "La venta no existe." });
        }

        if (venta.estado !== 'Pendiente') {
            return res.status(400).send({ message: "La venta no puede ser pagada porque su estado es diferente a Pendiente." });
        }

        // Encontrar la billetera destino del comprador que tiene la moneda de la venta
        const billeteraDestino = await db.billeteras.findOne({
            where: {
                usuario_id: usuario_id,
                moneda_id: venta.moneda_id
            }
        });

        console.log("billetera destino", billeteraDestino);

        // Cambiar el estado de la venta y actualizar billetera_destino si se encontró una billetera adecuada
        venta.estado = 'En Validacion';
        venta.comprador_id = usuario_id;
        if (billeteraDestino) {
            venta.billetera_destino = billeteraDestino.id;
        }

        await venta.save();

        res.send({ message: 'Compra registrada correctamente, la compra ahora esta en validacion.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.confirmarVenta = async (req, res) => {
    const { id } = req.params; // ID de la venta

    try {
        const venta = await db.ventas.findByPk(id);

        if (!venta) {
            return res.status(404).send({ message: "Venta no encontrada." });
        }

        if (venta.estado !== 'En Validacion') {
            return res.status(400).send({ message: "La venta no puede ser confirmada porque su estado es diferente a 'En validacion'." });
        }

        // Obtener la billetera destino
        let billeteraDestino = await db.billeteras.findByPk(venta.billetera_destino);
        let billeteraOrigen = await db.billeteras.findByPk(venta.billetera_origen);

        if (!billeteraDestino) {
            const compradorId = venta.comprador_id;
            const monedaId = venta.moneda_id;

            const codigo = generarCodigo();

            billeteraDestino = await db.billeteras.create({
                usuario_id: compradorId,
                moneda_id: monedaId,
                saldo: 0,
                codigo
            });

            // Actualizar la venta con la nueva billetera destino
            venta.billetera_destino = billeteraDestino.id;
            await venta.save();
        }

        // Realizar la transferencia del monto de moneda a la billetera destino
        billeteraDestino.saldo = parseFloat(billeteraDestino.saldo) + parseFloat(venta.monto_moneda);
        billeteraOrigen.saldo = parseFloat(billeteraOrigen.saldo) - parseFloat(venta.monto_moneda);
        await billeteraDestino.save();
        await billeteraOrigen.save();

        const movimientoEgreso = await db.movimientos.create({
            descripcion: `Venta de moneda - ${venta.monto_moneda} `,
            billetera_id: venta.billetera_origen,
            montoMoneda: venta.monto_moneda,
            tipo: 2,
            movimientoReferencia: null
        });

        const movimientoIngreso = await db.movimientos.create({
            descripcion: `Compra de moneda - ${venta.monto_moneda} `,
            billetera_id: billeteraDestino.id,
            montoMoneda: venta.monto_moneda,
            tipo: 1,
            movimientoReferencia: movimientoEgreso.id
        });

        await db.movimientos.update(
            { movimientoReferencia: movimientoIngreso.id },
            { where: { id: movimientoEgreso.id } }
        );

        // Actualizar el estado de la venta a 'Vendida'
        venta.estado = 'Vendida';
        await venta.save();

        res.send({ message: "Venta confirmada y monto transferido a la billetera destino." });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

