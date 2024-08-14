module.exports = (sequelize, Sequelize) => {
    const UsuarioAuth = sequelize.define("usuarioauth", {
        usuario_id: {
            type: Sequelize.INTEGER,
            nullable: true
        },
        admin_id: {
            type: Sequelize.INTEGER,
            nullable: true
        },
        token: {
            type: Sequelize.STRING
        },
        rol: {
            type: Sequelize.INTEGER
        }
    });
    return UsuarioAuth;
}