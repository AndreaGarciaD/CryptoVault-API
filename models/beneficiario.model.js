module.exports = (sequelize, Sequelize) => {
    const Beneficiario = sequelize.define("beneficiario", {
        nombre_referencia: {
            type: Sequelize.STRING
        },
        codigo_billetera: {
            type: Sequelize.STRING
        },
        usuario_id: {
            type: Sequelize.INTEGER
        },
    });
    return Beneficiario;
}