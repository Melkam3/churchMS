import express from 'express';
import { getMinistries, getMinistry, createMinistry, updateMinistry, deleteMinistry, assignMember, removeMember } from '../controllers/ministry.controller.js';
import { ministryValidator } from '../validators/ministry.validator.js';
import { validate } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getMinistries);
router.get('/:id', getMinistry);
router.post('/', ministryValidator, validate, createMinistry);
router.put('/:id', ministryValidator, validate, updateMinistry);
router.delete('/:id', deleteMinistry);
router.post('/:id/members', assignMember);
router.delete('/:id/members/:memberId', removeMember);

export default router;
