module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        }
    });
    return Usuario;
}