module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/movimiento.controller.js");
    let router = require("express").Router();

    router.get("/billetera/:id", checkUserMiddleware, controller.listMovimientosPorBilleteraId);
    router.delete("/:id", checkUserMiddleware, controller.deleteMovimiento);
    router.get("/usuario/:id", checkUserMiddleware, controller.getMovimientosPorUsuarioId);

    app.use('/api/movimiento', router);
}