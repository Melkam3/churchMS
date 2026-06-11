import express from 'express';
import { getFamilies, getFamily, createFamily, updateFamily, deleteFamily, addMemberToFamily } from '../controllers/family.controller.js';
import { familyValidator } from '../validators/family.validator.js';
import { validate } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getFamilies);
router.get('/:id', getFamily);
router.post('/', familyValidator, validate, createFamily);
router.put('/:id', familyValidator, validate, updateFamily);
router.delete('/:id', deleteFamily);
router.post('/:id/members', addMemberToFamily);

export default router;
