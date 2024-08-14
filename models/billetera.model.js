module.exports = (sequelize, Sequelize) => {
    const Billetera = sequelize.define("billetera", {
        usuario_id: {
            type: Sequelize.INTEGER
        },
        moneda_id: {
            type: Sequelize.INTEGER
        },
        saldo: {
            type: Sequelize.DECIMAL(40, 10)
        },
        codigo: {
            type: Sequelize.STRING
        }
    });
    return Billetera;
}