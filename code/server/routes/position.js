const express = require('express');

const router = express.Router();

const posController = require('../controllers/positionController');

router.get('/positions', posController.getPositions);

router.post('/position', posController.addPosition);

router.put('/position/:positionID', posController.editPosition);
router.put('/position/:positionID/changeID', posController.editPositionID);

router.delete('/position/:positionID', posController.deletePosition);

module.exports = router;