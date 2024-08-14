module.exports = app => {
    const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
    const controller = require("../controllers/admin.controller.js");
    let router = require("express").Router();

    router.get("/", controller.listAdmin);
    router.post("/", controller.createAdmin);
    router.put("/:id", checkUserMiddleware, controller.updateAdmin);
    router.patch("/:id", checkUserMiddleware, controller.updateAdmin);
    router.delete("/:id", checkUserMiddleware, controller.deleteAdmin);

    app.use('/api/admin', router);
}