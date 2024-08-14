module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/tarjeta.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listTarjetas);
    router.post("/", checkUserMiddleware, controller.createTarjeta);
    router.get("/:id", checkUserMiddleware, controller.getTarjetaById);
    router.get("/usuario/:id", checkUserMiddleware, controller.getTarjetasPorUsuario);
    router.put("/:id", checkUserMiddleware, controller.updateTarjeta);
    router.delete("/:id", checkUserMiddleware, controller.deleteTarjeta);

    app.use('/api/tarjeta', router);
}