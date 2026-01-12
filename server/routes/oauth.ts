import { Router, Request, Response } from 'express';
import passport from '../config/passport';
import { generateToken } from '../utils/jwt';

const router = Router();
const APP_URL = process.env.APP_URL || 'http://localhost:5000';

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${APP_URL}/login?error=oauth_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as { id: string; email: string; username: string };

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Redirect to frontend with token
    res.redirect(`${APP_URL}/oauth/callback?token=${token}`);
  }
);

// GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${APP_URL}/login?error=oauth_failed` }),
  (req: Request, res: Response) => {
    const user = req.user as { id: string; email: string; username: string };

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Redirect to frontend with token
    res.redirect(`${APP_URL}/oauth/callback?token=${token}`);
  }
);

export default router;
