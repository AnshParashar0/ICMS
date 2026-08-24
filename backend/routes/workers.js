const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// ── GET /api/workers — Get all workers (ADMIN) ──────────────────────
// Matches Java: WorkerController.getAllWorkers()
router.get('/', auth, admin, async (req, res) => {
    try {
        const workers = await Worker.find().sort({ createdAt: -1 });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── GET /api/workers/stats — Department statistics (ADMIN) ──────────
// Matches Java: WorkerController.getDepartmentStats()
// NOTE: Must be defined BEFORE /:id to avoid "stats" being treated as an ID
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const workers = await Worker.find();
        const stats = {};
        workers.forEach(w => {
            const dept = w.department || 'Unknown';
            stats[dept] = (stats[dept] || 0) + 1;
        });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── GET /api/workers/department/:dept — Workers by department (ADMIN) ─
// Matches Java: WorkerController.getByDepartment()
router.get('/department/:dept', auth, admin, async (req, res) => {
    try {
        const workers = await Worker.find({ department: req.params.dept });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── POST /api/workers — Add worker (ADMIN) ──────────────────────────
// Matches Java: WorkerController.addWorker()
router.post('/', auth, admin, async (req, res) => {
    try {
        const { name, department, phone, email, status } = req.body;
        const worker = new Worker({
            name,
            department,
            phone,
            email,
            status: status || 'AVAILABLE'
        });
        await worker.save();
        res.json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── PUT /api/workers/:id — Update worker (ADMIN) ────────────────────
// Matches Java: WorkerController.updateWorker()
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, phone, email, status } = req.body;

        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Update fields (matches Java WorkerService.updateWorker)
        if (name !== undefined) worker.name = name;
        if (department !== undefined) worker.department = department;
        if (phone !== undefined) worker.phone = phone;
        if (email !== undefined) worker.email = email;
        if (status !== undefined) worker.status = status;

        await worker.save();
        res.json(worker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ── DELETE /api/workers/:id — Delete worker (ADMIN) ─────────────────
// Matches Java: WorkerController.deleteWorker()
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await Worker.findById(id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        await Worker.findByIdAndDelete(id);
        res.json({ message: 'Worker deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
