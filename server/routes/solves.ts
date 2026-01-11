import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

const router = Router();

// Get all solves
router.get('/solves', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, time, scramble, timestamp FROM solves ORDER BY timestamp DESC'
    );

    // Convert timestamp strings to Date objects for consistency with frontend
    const solves = result.rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp)
    }));

    res.json(solves);
  } catch (error) {
    console.error('Error fetching solves:', error);
    res.status(500).json({ error: 'Failed to fetch solves' });
  }
});

// Create a new solve
router.post('/solves', async (req: Request, res: Response) => {
  const { id, time, scramble, timestamp } = req.body;

  if (!id || !time || !scramble || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO solves (id, time, scramble, timestamp) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, time, scramble, new Date(timestamp)]
    );

    const solve = {
      ...result.rows[0],
      timestamp: new Date(result.rows[0].timestamp)
    };

    res.status(201).json(solve);
  } catch (error) {
    console.error('Error creating solve:', error);
    res.status(500).json({ error: 'Failed to create solve' });
  }
});

// Delete a solve
router.delete('/solves/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM solves WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Solve not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting solve:', error);
    res.status(500).json({ error: 'Failed to delete solve' });
  }
});

// Clear all solves
router.delete('/solves', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM solves');
    res.status(204).send();
  } catch (error) {
    console.error('Error clearing solves:', error);
    res.status(500).json({ error: 'Failed to clear solves' });
  }
});

export default router;
