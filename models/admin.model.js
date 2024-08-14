module.exports = (sequelize, Sequelize) => {
    const Admin = sequelize.define("admin", {
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
    return Admin;
}