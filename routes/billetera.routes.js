module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/billetera.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listBilleteras);
    router.post("/", checkUserMiddleware, controller.createBilletera);
    router.get("/:id", checkUserMiddleware, controller.getBilleteraById);
    router.get("/usuario/:id", checkUserMiddleware, controller.getBilleterasPorUsuario);
    router.post("/deposito/:id", checkUserMiddleware, controller.depositarEnBilleteraId);
    router.post("/transferencia/:id", checkUserMiddleware, controller.transferirDesdeBilleteraId);
    router.put("/:id", checkUserMiddleware, controller.updateBilletera);
    router.patch("/:id", checkUserMiddleware, controller.updateBilletera);
    router.delete("/:id", checkUserMiddleware, controller.deleteBilletera);

    app.use('/api/billetera', router);
}