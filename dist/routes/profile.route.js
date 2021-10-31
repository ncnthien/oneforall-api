"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controller/profile.controller");
const profile_middleware_1 = require("../middleware/profile.middleware");
const router = (0, express_1.Router)();
router.get('/', profile_controller_1.getProfile);
router.put('/', profile_middleware_1.validateUpdatedProfile, profile_controller_1.updateProfile);
router.post('/change-password', profile_controller_1.changePassword);
exports.default = router;