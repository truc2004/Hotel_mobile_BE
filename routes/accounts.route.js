const express = require('express');
const router = express.Router();

const controller = require("../controller/accounts.controller");

router.get("/find", controller.findAccountByEmail);
router.post("/", controller.createOrGetAccount);
router.put("/:account_id", controller.updateAccount); 

module.exports = router;