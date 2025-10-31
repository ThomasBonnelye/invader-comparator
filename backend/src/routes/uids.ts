import { Router, Request, Response } from 'express';
import { User, IUser } from '../models/User.js';

const router = Router();

const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    res.json({
      myUid: user.myUid,
      othersUids: user.othersUids,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve UIDs' });
  }
});

router.put('/my-uid', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Invalid UID' });
    }

    user.myUid = uid.trim();
    await user.save();

    res.json({ success: true, myUid: user.myUid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update UID' });
  }
});

router.put('/others-uids', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uids } = req.body;

    if (!Array.isArray(uids)) {
      return res.status(400).json({ error: 'Invalid UIDs format' });
    }

    user.othersUids = uids
      .filter((uid) => typeof uid === 'string' && uid.trim() !== '')
      .map((uid) => uid.trim());

    await user.save();

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update UIDs' });
  }
});

router.post('/others-uids', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'Invalid UID' });
    }

    const cleanUid = uid.trim();

    if (!user.othersUids.includes(cleanUid)) {
      user.othersUids.push(cleanUid);
      await user.save();
    }

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add UID' });
  }
});

router.delete('/others-uids/:uid', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.params;

    user.othersUids = user.othersUids.filter((u) => u !== uid);
    await user.save();

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete UID' });
  }
});

export default router;
