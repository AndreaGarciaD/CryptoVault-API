const db = require("../models");

exports.listMovimientosPorBilleteraId = async (req, res) => {
    const id = req.params.id;
    try {
        const movimientos = await db.movimientos.findAll({
            where: {
                billetera_id: id,
            },
            include: [
                "billetera"
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        res.send(movimientos);
    } catch (error) {
        console.error('Error al obtener los movimientos:', error);
        res.status(500).send({ message: 'Error al obtener los movimientos' });
    }
};

exports.deleteMovimiento = async (req, res) => {
    const id = req.params.id;
    const movimiento = await db.movimientos.findByPk(id);

    if (!movimiento){
        res.status(404).send({ message: `No se encontro el movimiento` });
        return;
    }

    await movimiento.destroy();
    res.send({ message: `El movimiento fue eliminada` });
};

exports.getMovimientosPorUsuarioId = async (req, res) => {
    const id = req.params.id;
    const movimientos = await db.movimientos.findAll({
        include: [
            {
                model: db.billeteras,
                as: 'billetera',
                where: {
                    usuario_id: id
                }
            }
        ]
    });

    res.send(movimientos);
}