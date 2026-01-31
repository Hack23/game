---
name: security-by-design
description: High-level security principles and enforcement rules for building secure applications from the ground up with defense-in-depth
license: MIT
---

# Security-by-Design Skill

## Context
This skill applies to:
- All code that handles user input, authentication, or sensitive data
- Any feature that introduces security boundaries or trust decisions
- API endpoints, data processing, or external integrations
- Infrastructure configuration and deployment pipelines
- Security-critical functionality throughout the application lifecycle

Security-by-Design means building security into every phase of development, not adding it as an afterthought. This skill enforces foundational security principles aligned with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC).

## Rules

1. **Assume Breach**: Design systems assuming attackers will gain access - limit blast radius and lateral movement
2. **Defense in Depth**: Implement multiple layers of security controls (never rely on a single control)
3. **Principle of Least Privilege**: Grant minimum permissions required for functionality
4. **Fail Securely**: Systems must fail to a secure state, not an insecure one
5. **Never Trust Input**: Validate, sanitize, and encode all input on both client and server
6. **Secure by Default**: All configurations must be secure by default (disable unused features)
7. **Encrypt Everything**: Use strong encryption (AES-256) for data at rest and TLS 1.3+ for data in transit
8. **Separation of Duties**: Separate development, deployment, and production access
9. **Audit Everything**: Log security-relevant events for compliance and forensics
10. **Minimize Attack Surface**: Remove or disable unnecessary features, endpoints, and dependencies
11. **No Secrets in Code**: Never hardcode credentials, API keys, or sensitive data
12. **Security Testing**: Include security tests (authentication, authorization, input validation, encryption)
13. **Keep Dependencies Updated**: Regularly patch dependencies to fix known vulnerabilities
14. **Validate Security Controls**: Test that security features work as intended
15. **Document Security Decisions**: Document threat models, security architecture, and risk decisions

## Examples

### ✅ Good Pattern: Defense in Depth

```typescript
/**
 * Multi-layered security for user input processing
 * ISMS Policy: SC-002 (Secure Coding Standards)
 * Compliance: OWASP Top 10 (A03:2021 - Injection)
 */
export class UserInputHandler {
  // Layer 1: Client-side validation (UX, not security)
  static validateFormat(input: string): boolean {
    return /^[a-zA-Z0-9\s\-_.@]{3,100}$/.test(input);
  }
  
  // Layer 2: Server-side validation (security boundary)
  static validateInput(input: unknown): string {
    if (typeof input !== 'string') {
      throw new ValidationError('Input must be a string');
    }
    
    if (input.length < 3 || input.length > 100) {
      throw new ValidationError('Input length must be 3-100 characters');
    }
    
    if (!/^[a-zA-Z0-9\s\-_.@]+$/.test(input)) {
      throw new ValidationError('Input contains invalid characters');
    }
    
    return input;
  }
  
  // Layer 3: Sanitization (remove dangerous characters)
  static sanitize(input: string): string {
    // Remove any potential XSS/injection characters
    return input
      .replace(/[<>'"&]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }
  
  // Layer 4: Encoding for output context (HTML)
  static encodeHTML(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  
  // Layer 5: Content Security Policy (browser-level protection)
  static getCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': 
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:; " +
        "font-src 'self'; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none';"
    };
  }
  
  // Complete processing pipeline
  static processUserInput(rawInput: unknown): string {
    const validated = this.validateInput(rawInput);
    const sanitized = this.sanitize(validated);
    const encoded = this.encodeHTML(sanitized);
    return encoded;
  }
}
```

### ✅ Good Pattern: Secure Configuration

```typescript
/**
 * Security configuration with secure defaults
 * ISMS Policy: SC-001 (Secure Configuration Policy)
 */
export const securityConfig = {
  // Authentication
  session: {
    timeout: 15 * 60 * 1000, // 15 minutes (ISMS requirement)
    secure: true, // HTTPS only
    httpOnly: true, // Prevent XSS access to cookies
    sameSite: 'strict' as const, // CSRF protection
    maxAge: 15 * 60 * 1000
  },
  
  // Password requirements (ISO 27001:2022 A.5.15)
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000 // 30 minutes
  },
  
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"], // Required for Three.js
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'"],
    'connect-src': ["'self'"],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"]
  },
  
  // Security headers (OWASP recommendations)
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },
  
  // Rate limiting (DoS protection)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later'
  },
  
  // Encryption
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 256,
    ivLength: 16,
    saltLength: 64,
    iterations: 100000
  }
} as const;
```

### ✅ Good Pattern: Least Privilege

```typescript
/**
 * Role-based access control with least privilege
 * ISMS Policy: AC-001 (Access Control Policy)
 * Compliance: ISO 27001:2022 A.5.15, NIST CSF PR.AC-4
 */
interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
}

enum Role {
  GUEST = 'guest',
  PLAYER = 'player',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.GUEST]: [
    { resource: 'game', action: 'read' }
  ],
  [Role.PLAYER]: [
    { resource: 'game', action: 'read' },
    { resource: 'game', action: 'write' }, // Save progress
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'write' } // Update own profile
  ],
  [Role.MODERATOR]: [
    { resource: 'game', action: 'read' },
    { resource: 'game', action: 'write' },
    { resource: 'profile', action: 'read' },
    { resource: 'profile', action: 'write' },
    { resource: 'reports', action: 'read' },
    { resource: 'reports', action: 'write' }
  ],
  [Role.ADMIN]: [
    { resource: '*', action: 'admin' } // Full access
  ]
};

export function hasPermission(
  userRole: Role,
  resource: string,
  action: Permission['action']
): boolean {
  const permissions = rolePermissions[userRole];
  
  return permissions.some(
    p => (p.resource === '*' || p.resource === resource) &&
         (p.action === 'admin' || p.action === action)
  );
}

// Usage in API endpoint
export async function updateGameData(
  userId: string,
  gameData: GameData
): Promise<void> {
  const user = await getUserById(userId);
  
  // Enforce least privilege - check permission
  if (!hasPermission(user.role, 'game', 'write')) {
    throw new AuthorizationError('Insufficient permissions');
  }
  
  // Additional check: users can only modify their own data
  if (gameData.userId !== userId && user.role !== Role.ADMIN) {
    throw new AuthorizationError('Cannot modify other users\' data');
  }
  
  await saveGameData(gameData);
  
  // Audit log
  await logSecurityEvent({
    type: 'game_data_update',
    userId,
    resource: 'game',
    action: 'write',
    timestamp: new Date()
  });
}
```

### ❌ Bad Pattern: Single Layer of Security

```typescript
// Bad: Only client-side validation (easily bypassed)
function badValidation(input: string): boolean {
  return input.length > 0; // Client-side only, no server validation!
}

// Bad: Directly using user input in DOM
function badDisplay(username: string): void {
  document.getElementById('user').innerHTML = username; // XSS vulnerability!
}

// Bad: No defense in depth
function badAuth(password: string): boolean {
  return password === 'admin123'; // No hashing, no rate limiting, hardcoded!
}
```

### ❌ Bad Pattern: Insecure Defaults

```typescript
// Bad: Insecure default configuration
const badConfig = {
  session: {
    secure: false, // Allows HTTP!
    httpOnly: false, // JavaScript can access session cookie!
    sameSite: 'none' as const, // No CSRF protection!
    timeout: 24 * 60 * 60 * 1000 // 24 hours - too long!
  },
  
  password: {
    minLength: 6, // Too short!
    requireSpecialChars: false // Weak passwords allowed!
  },
  
  csp: undefined // No Content Security Policy!
};
```

### ❌ Bad Pattern: Hardcoded Secrets

```typescript
// Bad: Secrets in code (violates SC-003 Secret Management Policy)
const API_KEY = "sk_live_abc123def456"; // NEVER DO THIS!
const DB_PASSWORD = "admin123"; // NEVER DO THIS!
const JWT_SECRET = "mysecret"; // NEVER DO THIS!

// Bad: Committing .env file with secrets
// .env file should be in .gitignore!

// Good: Use environment variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!API_KEY || !DB_PASSWORD || !JWT_SECRET) {
  throw new Error('Missing required environment variables');
}
```

### ❌ Bad Pattern: Insufficient Logging

```typescript
// Bad: No security logging
async function badLogin(username: string, password: string): Promise<void> {
  if (await verifyPassword(username, password)) {
    createSession(username);
    // No logging of successful login!
  } else {
    throw new Error('Invalid credentials');
    // No logging of failed attempt!
  }
}

// Good: Comprehensive security logging
async function goodLogin(username: string, password: string): Promise<void> {
  const ipAddress = getClientIP();
  
  try {
    if (await verifyPassword(username, password)) {
      await logSecurityEvent({
        type: 'login_success',
        username,
        ipAddress,
        timestamp: new Date()
      });
      createSession(username);
    } else {
      await logSecurityEvent({
        type: 'login_failure',
        username,
        ipAddress,
        timestamp: new Date(),
        reason: 'invalid_credentials'
      });
      throw new AuthenticationError('Invalid credentials');
    }
  } catch (error) {
    await logSecurityEvent({
      type: 'login_error',
      username,
      ipAddress,
      timestamp: new Date(),
      error: error.message
    });
    throw error;
  }
}
```

## References

### ISMS Policies
- [Hack23 AB ISMS Public Repository](https://github.com/Hack23/ISMS-PUBLIC)
- [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)
- [Access Control Policy (AC-001)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/AC-001.md)
- [Secure Configuration Policy (SC-001)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/SC-001.md)
- [Secure Coding Standards (SC-002)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/SC-002.md)

### Security Frameworks
- [ISO 27001:2022](https://www.iso.org/isoiec-27001-information-security.html)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8)

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)

### Security Tools
- `npm audit` - Dependency vulnerability scanning
- `snyk` - Continuous security monitoring
- Dependabot - Automated dependency updates
- CodeQL - Static analysis for vulnerabilities

## Remember

- **Security is Everyone's Responsibility**: Every developer must understand and implement security controls
- **Assume Breach**: Design for compromise - limit blast radius and enable detection
- **Defense in Depth**: Never rely on a single security control - layer multiple controls
- **Fail Securely**: When things break, they should break in a secure state
- **Least Privilege**: Grant only the minimum permissions required
- **Zero Trust**: Verify everything, trust nothing
- **Secure Defaults**: Out-of-the-box configuration must be secure
- **No Secrets in Code**: Use environment variables and secret management systems
- **Encrypt Everything**: Data at rest (AES-256) and in transit (TLS 1.3+)
- **Validate All Input**: Client-side UX, server-side security
- **Audit Everything**: Log security events for compliance and forensics
- **Test Security**: Security tests are as important as functional tests
- **Stay Updated**: Patch dependencies regularly to fix known vulnerabilities
- **Document Decisions**: Threat models, security architecture, and risk decisions
- **Compliance is Continuous**: Security is not a one-time activity but an ongoing process
