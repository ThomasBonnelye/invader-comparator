import { Router, Request, Response } from 'express';
import { User, IUser } from '../models/User.js';

const router = Router();

// Middleware pour vérifier l'authentification
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Non authentifié' });
};

// Récupérer les UIDs de l'utilisateur connecté
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    res.json({
      myUid: user.myUid,
      othersUids: user.othersUids,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des UIDs' });
  }
});

// Mettre à jour mon UID
router.put('/my-uid', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'UID invalide' });
    }

    user.myUid = uid.trim();
    await user.save();

    res.json({ success: true, myUid: user.myUid });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'UID' });
  }
});

// Mettre à jour les UIDs des autres
router.put('/others-uids', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uids } = req.body;

    if (!Array.isArray(uids)) {
      return res.status(400).json({ error: 'Le format des UIDs est invalide' });
    }

    // Filtrer et nettoyer les UIDs
    user.othersUids = uids
      .filter((uid) => typeof uid === 'string' && uid.trim() !== '')
      .map((uid) => uid.trim());

    await user.save();

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour des UIDs' });
  }
});

// Ajouter un UID aux autres
router.post('/others-uids', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.body;

    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'UID invalide' });
    }

    const cleanUid = uid.trim();
    
    if (!user.othersUids.includes(cleanUid)) {
      user.othersUids.push(cleanUid);
      await user.save();
    }

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'UID' });
  }
});

// Supprimer un UID des autres
router.delete('/others-uids/:uid', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const { uid } = req.params;

    user.othersUids = user.othersUids.filter((u) => u !== uid);
    await user.save();

    res.json({ success: true, othersUids: user.othersUids });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'UID' });
  }
});

export default router;
