# Server Architecture and Patterns

## Authentication System

### Overview
The authentication system uses JWT tokens for stateless authentication, with support for email/password registration and OAuth (Google, GitHub).

### Key Components

**Database Schema (`db.ts`)**
- `users` table includes: id, email, username, password_hash, oauth_provider, oauth_id, email verification fields, password reset fields
- Indexes on email, username, and oauth provider for fast lookups
- Use `gen_random_uuid()` for UUID generation (PostgreSQL built-in)

**JWT Authentication (`utils/jwt.ts`)**
- Token generation with configurable expiry (default 7 days)
- Token verification with error handling
- Verification and reset token generation using crypto.randomBytes
- JWT_SECRET should be set in environment variables for production

**Email Service (`utils/email.ts`)**
- Configured with nodemailer for SMTP
- Gracefully handles missing SMTP config (logs URLs to console in dev)
- Sends verification emails and password reset emails
- Templates include links to frontend with tokens

**Authentication Middleware (`middleware/auth.ts`)**
- `authenticateToken`: Requires valid JWT, returns 401/403 on failure
- `optionalAuthentication`: Adds user to request if token present, but doesn't fail if missing
- Extends Express Request type with `user` property (JWTPayload)

**Auth Routes (`routes/auth.ts`)**
- POST `/api/auth/register` - Register with email/username/password
- POST `/api/auth/login` - Login with email/password
- POST `/api/auth/verify-email` - Verify email with token
- POST `/api/auth/request-password-reset` - Request password reset email
- POST `/api/auth/reset-password` - Reset password with token
- GET `/api/auth/me` - Get current user (protected)
- POST `/api/auth/logout` - Logout (client-side token removal)

**OAuth Routes (`routes/oauth.ts`)**
- GET `/api/auth/oauth/google` - Initiate Google OAuth
- GET `/api/auth/oauth/google/callback` - Google OAuth callback
- GET `/api/auth/oauth/github` - Initiate GitHub OAuth
- GET `/api/auth/oauth/github/callback` - GitHub OAuth callback
- OAuth users have `password_hash` set to 'OAUTH' and `is_email_verified` set to true automatically

**Passport Configuration (`config/passport.ts`)**
- Google and GitHub OAuth strategies configured
- Strategies only registered if client ID/secret are provided
- Creates new user on first OAuth login
- Prevents OAuth if email already exists with different method

### Patterns to Follow

1. **Password Security**: Always use bcrypt with salt rounds of 10 for hashing passwords
2. **Token Validation**: Extract token from Authorization header as `Bearer TOKEN`
3. **Error Messages**: Don't reveal whether email exists for password reset (security best practice)
4. **Database Queries**: Use parameterized queries ($1, $2) to prevent SQL injection
5. **User Creation**: Generate verification tokens on registration and send verification email
6. **OAuth Flow**: Redirect to frontend with JWT token in query param after successful OAuth
7. **Environment Variables**: All secrets (JWT_SECRET, SMTP, OAuth keys) must be in .env file

### Adding Protected Routes

To protect a route, import and use the middleware:

```typescript
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

router.get('/protected', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  // Your protected route logic
});
```

### Testing Authentication

1. Register a user: POST to `/api/auth/register` with email, username, password
2. Login: POST to `/api/auth/login` with email, password - returns JWT token
3. Use token: Add header `Authorization: Bearer <token>` to protected requests
4. OAuth: Navigate to `/api/auth/oauth/google` or `/api/auth/oauth/github` in browser

### Database Updates

When modifying the users table schema:
1. Update the CREATE TABLE statement in `db.ts` > `initializeDatabase()`
2. Add appropriate indexes for new columns that will be queried
3. Restart the server to apply changes (idempotent with IF NOT EXISTS)

### Security Considerations

- JWT_SECRET must be a long random string in production
- HTTPS required in production for secure token transmission
- Implement rate limiting on auth endpoints to prevent brute force
- Consider token refresh mechanism for long-lived sessions
- Email verification recommended before granting full access
- Password reset tokens expire after 1 hour
- OAuth only works if GOOGLE_CLIENT_ID/GITHUB_CLIENT_ID are configured
