module.exports = (sequelize, Sequelize) => {
    const Movimiento = sequelize.define("movimiento", {
        descripcion: {
            type: Sequelize.STRING
        },
        billetera_id: {
            type: Sequelize.STRING
        },
        montoMoneda: {
            type: Sequelize.DECIMAL(40, 10)
        },
        tipo: {
            type: Sequelize.INTEGER
        },
        movimientoReferencia: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
    return Movimiento;
}