import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { pool } from '../db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const API_URL = process.env.API_URL || 'http://localhost:3001';

// Google OAuth Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/oauth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Check if user exists
          let result = await pool.query(
            'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
            ['google', profile.id]
          );

          let user;

          if (result.rows.length === 0) {
            // Check if email already exists
            const emailCheck = await pool.query(
              'SELECT id FROM users WHERE email = $1',
              [email]
            );

            if (emailCheck.rows.length > 0) {
              return done(new Error('Email already registered with a different method'));
            }

            // Create new user
            const username = profile.displayName?.replace(/\s+/g, '_').toLowerCase() || `user_${Date.now()}`;

            result = await pool.query(
              `INSERT INTO users (email, username, password_hash, oauth_provider, oauth_id, is_email_verified)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING *`,
              [email, username, 'OAUTH', 'google', profile.id, true]
            );
            user = result.rows[0];
          } else {
            user = result.rows[0];
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${API_URL}/api/auth/oauth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: { id: string; username?: string; emails?: Array<{ value: string }> }, done: (error: Error | null, user?: unknown) => void) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in GitHub profile'));
          }

          // Check if user exists
          let result = await pool.query(
            'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
            ['github', profile.id]
          );

          let user;

          if (result.rows.length === 0) {
            // Check if email already exists
            const emailCheck = await pool.query(
              'SELECT id FROM users WHERE email = $1',
              [email]
            );

            if (emailCheck.rows.length > 0) {
              return done(new Error('Email already registered with a different method'));
            }

            // Create new user
            const username = profile.username || `user_${Date.now()}`;

            result = await pool.query(
              `INSERT INTO users (email, username, password_hash, oauth_provider, oauth_id, is_email_verified)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING *`,
              [email, username, 'OAUTH', 'github', profile.id, true]
            );
            user = result.rows[0];
          } else {
            user = result.rows[0];
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: string }).id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

export default passport;
