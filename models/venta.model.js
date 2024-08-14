module.exports = (sequelize, Sequelize) => {
    const Venta = sequelize.define("venta", {
        moneda_id: {
            type: Sequelize.INTEGER
        },
        valor_venta: {
            type: Sequelize.DECIMAL(40, 10)
        },
        monto_moneda: {
            type: Sequelize.DECIMAL(40, 10)
        },
        billetera_origen: {
            type: Sequelize.INTEGER
        },
        billetera_destino: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        metodo_pago: {
            type: Sequelize.STRING
        },
        estado: {
            type: Sequelize.STRING
        },
        comprador_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
    });
    return Venta;
}