module.exports = (sequelize, Sequelize) => {
    const Tarjeta = sequelize.define("tarjeta", {
        nombre: {
            type: Sequelize.STRING
        },
        numero: {
            type: Sequelize.STRING
        },
        cvv: {
            type: Sequelize.INTEGER
        },
        fechVencimiento: {
            type: Sequelize.STRING
        },
        usuario_id: {
            type: Sequelize.INTEGER
        }
    });
    return Tarjeta;
}