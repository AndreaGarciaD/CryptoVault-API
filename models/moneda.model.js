module.exports = (sequelize, Sequelize) => {
    const Moneda = sequelize.define("moneda", {
        nombre: {
            type: Sequelize.STRING
        },
        valorUsd: {
            type: Sequelize.DECIMAL(40, 10)
        }
    });
    return Moneda;
}