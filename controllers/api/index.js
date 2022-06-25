const router = require('express').Router();
const users_route = require("./Users");
const thoughts_route = require("./Thoughts");

router.use("/users", users_route);
router.use("/thoughts", thoughts_route);

module.exports = router;

