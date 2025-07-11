import { Router } from 'express';
import { getProjects, createProject, updateProjectStatus, deleteProject } from '../controllers/project.controller';
import { protect } from '../middleware/auth.middleware';
const router = Router();

// All these routes are protected
router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.patch('/:id/status', updateProjectStatus);
router.delete('/:id', deleteProject); // Permanent delete

export default router;