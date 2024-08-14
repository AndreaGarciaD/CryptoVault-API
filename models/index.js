// const { on } = require("nodemon");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.admins = require("./admin.model.js")(sequelize, Sequelize);
db.tokens = require("./usuarioauth.model.js")(sequelize, Sequelize);
db.monedas = require("./moneda.model.js")(sequelize, Sequelize);
db.billeteras = require("./billetera.model.js")(sequelize, Sequelize);
db.tarjetas = require("./tarjeta.model.js")(sequelize, Sequelize);
db.movimientos = require("./movimiento.model.js")(sequelize, Sequelize);
db.cuentas = require("./cuentaBancaria.model.js")(sequelize, Sequelize);
db.beneficiarios = require("./beneficiario.model.js")(sequelize, Sequelize);
db.ventas = require("./venta.model.js")(sequelize, Sequelize);

//----relaciones usuario---
db.usuarios.hasMany(db.tokens, {
    foreignKey: "usuario_id",
    as: "tokens",
    onDelete: "CASCADE",
});
db.tokens.belongsTo(db.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
});

db.usuarios.hasMany(db.billeteras, {
    foreignKey: "usuario_id",
    as: "billetera",
    onDelete: "CASCADE",
});
db.billeteras.belongsTo(db.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
});

db.usuarios.hasMany(db.tarjetas, {
    foreignKey: "usuario_id",
    as: "tarjeta",
    onDelete: "CASCADE",
});
db.tarjetas.belongsTo(db.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
});

db.usuarios.hasMany(db.cuentas, {
    foreignKey: "usuario_id",
    as: "cuenta",
    onDelete: "CASCADE",
});
db.cuentas.belongsTo(db.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
});

db.usuarios.hasMany(db.beneficiarios, {
    foreignKey: "usuario_id",
    as: "beneficiario",
    onDelete: "CASCADE",
});
db.beneficiarios.belongsTo(db.usuarios, {
    foreignKey: "usuario_id",
    as: "usuario",
});

db.usuarios.hasMany(db.ventas, {
    foreignKey: "comprador_id",
    as: "venta",
    onDelete: "CASCADE",
});
db.ventas.belongsTo(db.usuarios, {
    foreignKey: "comprador_id",
    as: "comprador",
});


//----relaciones admin---
db.admins.hasMany(db.tokens, {
    foreignKey: "admin_id",
    as: "tokens",
    onDelete: "CASCADE",
});
db.tokens.belongsTo(db.admins, {
    foreignKey: "admin_id",
    as: "admin",
});

//---relaciones monedas---
db.monedas.hasMany(db.billeteras, {
    foreignKey: "moneda_id",
    as: "billetera",
    onDelete: "CASCADE",
});
db.billeteras.belongsTo(db.monedas, {
    foreignKey: "moneda_id",
    as: "moneda",
});

db.monedas.hasMany(db.cuentas, {
    foreignKey: "moneda_id",
    as: "cuenta",
    onDelete: "CASCADE",
});
db.cuentas.belongsTo(db.monedas, {
    foreignKey: "moneda_id",
    as: "moneda",
});

db.monedas.hasMany(db.ventas, {
    foreignKey: "moneda_id",
    as: "venta",
    onDelete: "CASCADE",
});
db.ventas.belongsTo(db.monedas, {
    foreignKey: "moneda_id",
    as: "moneda",
});


//---relaciones billetera---
db.billeteras.hasMany(db.movimientos, {
    foreignKey: "billetera_id",
    as: "movimiento",
    onDelete: "CASCADE",
});
db.movimientos.belongsTo(db.billeteras, {
    foreignKey: "billetera_id",
    as: "billetera",
});

db.billeteras.hasMany(db.ventas, {
    foreignKey: "billetera_origen",
    as: "venta",
    onDelete: "CASCADE",
});
db.ventas.belongsTo(db.billeteras, {
    foreignKey: "billetera_origen",
    as: "billetera",
});


module.exports = db;

