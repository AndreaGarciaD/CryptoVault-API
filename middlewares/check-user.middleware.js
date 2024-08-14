const db = require("../models");

exports.checkUserMiddleware = async (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
        return res.status(401).send({ message: "Usuario no autenticado" });
    }

    const token = tokenHeader.split(" ")[1];
    if(!tokenHeader.startsWith("Bearer ")){
        return res.status(401).send({ message: "Usuario no autenticado" });
    }
    if(!token){
        return res.status(401).send({ message: "Usuario no autenticado" });
    }

    const tokenDB = await db.tokens.findOne({
        where: {
            token: token
        }
    });
    if (!tokenDB) {
        return res.status(401).send({
            message: "Usuario no autenticado"
        });
    }
    // eslint-disable-next-line no-undef
    if (tokenDB.createdAt < new Date(Date.now() - 1000 * 60 * 60 * 24 * process.env.DAYS_FOR_TOKEN_EXPIRATION)) {
        await db.tokens.destroy({
            where: {
                token: token
            }
        });
        return res.status(401).send({
            message: "Token expired"
        });
    }
    let user = await db.usuarios.findOne({
        where: {
            id: tokenDB.usuario_id
        }
    });

    if (!user) {
        user = await db.admins.findOne({
            where: {
                id: tokenDB.admin_id
            }
        });
    }
    
    console.log("middleware user", user.correo);
    res.locals.user = user;

    next();
}