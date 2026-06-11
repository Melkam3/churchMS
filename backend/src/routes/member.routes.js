import express from 'express';
import { getMembers, getMember, createMember, updateMember, deleteMember, uploadPhoto } from '../controllers/member.controller.js';
import { memberValidator } from '../validators/member.validator.js';
import { validate } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', memberValidator, validate, createMember);
router.put('/:id', memberValidator, validate, updateMember);
router.delete('/:id', deleteMember);
router.post('/:id/photo', upload.single('photo'), uploadPhoto);

export default router;
