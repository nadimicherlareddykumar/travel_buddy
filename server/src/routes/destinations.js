const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');

router.get('/', getDestinations);
router.post('/', upload.single('image'), createDestination);
router.put('/:id', upload.single('image'), updateDestination);
router.delete('/:id', deleteDestination);

module.exports = router;
