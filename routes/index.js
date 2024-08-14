module.exports = app => {
    require ("./usuario.routes")(app);
    require ("./admin.routes")(app);
    require ("./auth.routes")(app);
    require ("./moneda.routes")(app);
    require ("./billetera.routes")(app);
    require ("./tarjeta.routes")(app);
    require ("./movimiento.routes")(app);
    require ("./cuenta.routes")(app);
    require ("./beneficiario.routes")(app);
    require ("./venta.routes")(app);
}