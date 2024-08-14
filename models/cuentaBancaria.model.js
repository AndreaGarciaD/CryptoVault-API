module.exports = (sequelize, Sequelize) => {
    const Cuenta = sequelize.define("cuenta", {
        numero_cuenta: {
            type: Sequelize.INTEGER
        },
        nombre: {
            type: Sequelize.STRING
        },
        documento_identificacion: {
            type: Sequelize.STRING
        },
        banco: {
            type: Sequelize.STRING
        },
        moneda_id: {
            type: Sequelize.INTEGER
        },
        usuario_id: {
            type: Sequelize.INTEGER
        }
    });
    return Cuenta;
}