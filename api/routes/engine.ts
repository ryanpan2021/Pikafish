import express, { Request, Response } from 'express';
import { getEngine } from '../utils/engineManager.js';

const router = express.Router();

router.post('/move', async (req: Request, res: Response) => {
  try {
    const { fen, depth } = req.body;
    
    if (!fen) {
      return res.status(400).json({ error: 'FEN string is required' });
    }

    const engine = getEngine();
    const move = await engine.getBestMove(fen, depth);

    if (!move) {
      return res.status(500).json({ error: 'Failed to get move from engine' });
    }

    res.json({ move });
  } catch (error) {
    console.error('Engine move error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/start', async (req: Request, res: Response) => {
  try {
    const engine = getEngine();
    res.json({ success: true, engineId: 'default' });
  } catch (error) {
    console.error('Engine start error:', error);
    res.status(500).json({ error: 'Failed to start engine' });
  }
});

router.post('/stop', async (req: Request, res: Response) => {
  try {
    const engine = getEngine();
    engine.close();
    res.json({ success: true });
  } catch (error) {
    console.error('Engine stop error:', error);
    res.status(500).json({ error: 'Failed to stop engine' });
  }
});

export default router;
