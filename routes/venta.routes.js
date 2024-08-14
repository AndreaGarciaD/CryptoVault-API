module.exports = app => {
    const controller = require("../controllers/venta.controller.js");
    let router = require("express").Router();

    router.post("/:id", controller.createVentaPorBilleteraId);
    router.delete("/:id", controller.deleteVenta);
    router.get("/usuario/:id", controller.getVentasPorUsuarioId);
    router.get("/:id", controller.getVentaById);
    router.get("/billetera/:id", controller.getVentasPorBilletera);
    router.get("/disponibles/:id", controller.getVentasDisponiblesPorUsuarioId);
    router.post("/comprar/:id/foto", controller.postComprobantePago);
    router.post("/comprar/:id", controller.postComprar);
    router.post("/confirmar/:id", controller.confirmarVenta);

    app.use('/api/venta', router);
}