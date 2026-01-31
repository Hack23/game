---
name: isms-compliance
description: ISMS policy alignment and compliance verification for Hack23 AB security standards (ISO 27001, NIST CSF 2.0, CIS Controls v8.1)
license: MIT
---

# ISMS Compliance Skill

## Context
This skill applies when:
- Adding new features, dependencies, or security controls
- Documenting security practices or policies
- Conducting security reviews or audits
- Implementing authentication, authorization, or cryptography
- Handling sensitive data or user information
- Creating security documentation or policy references

All security practices in this repository align with [Hack23 AB's Information Security Management System (ISMS)](https://github.com/Hack23/ISMS-PUBLIC) implementing ISO 27001:2022, NIST CSF 2.0, and CIS Controls v8.1.

## Rules

1. **Reference ISMS Policies**: Every security-related code change must reference applicable ISMS policies in comments or documentation
2. **Follow Defense in Depth**: Implement multiple layers of security controls (client-side validation + server-side validation + CSP headers + input sanitization)
3. **Document Security Decisions**: All security architecture decisions must be documented with ISMS policy references
4. **Verify Dependencies**: All new dependencies must be checked for known vulnerabilities before addition
5. **Maintain Security Headers**: Always configure security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
6. **Implement Secure Defaults**: All configurations must be secure by default (disable unused features, minimize attack surface)
7. **Apply Least Privilege**: Grant minimal permissions required for functionality
8. **Validate All Inputs**: Never trust user input - validate, sanitize, and encode on both client and server
9. **Encrypt Sensitive Data**: Use strong encryption (AES-256) for data at rest and TLS 1.3+ for data in transit
10. **Log Security Events**: Log authentication attempts, authorization failures, and security-relevant events
11. **Follow Secure SDLC**: Integrate security at every phase (design, development, testing, deployment)
12. **Conduct Code Reviews**: All security-related code requires peer review before merge
13. **Test Security Controls**: Write tests for authentication, authorization, input validation, and encryption
14. **Document Threat Model**: Identify and document threats, vulnerabilities, and mitigations
15. **Maintain Audit Trail**: Keep immutable logs of security events for compliance and forensics

## Examples

### ✅ Good Pattern: ISMS Policy Reference in Code

```typescript
/**
 * User authentication service
 * 
 * ISMS Policy: AC-001 (Access Control Policy)
 * - Implements multi-factor authentication (MFA)
 * - Password complexity: min 12 chars, mixed case, numbers, symbols
 * - Account lockout after 5 failed attempts
 * - Session timeout: 15 minutes of inactivity
 * 
 * Compliance: ISO 27001:2022 A.5.15, NIST CSF PR.AC-1, CIS Control 6.3
 */
export class AuthenticationService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly SESSION_TIMEOUT_MS = 15 * 60 * 1000;
  
  async authenticateUser(credentials: UserCredentials): Promise<AuthResult> {
    // Implementation with security controls
  }
}
```

### ✅ Good Pattern: Security Documentation

```markdown
## Security Architecture

### Authentication & Authorization
- **Policy**: [AC-001 Access Control Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/AC-001.md)
- **Implementation**: JWT tokens with RS256 signing, 15-minute expiry
- **Compliance**: ISO 27001:2022 A.5.15, NIST CSF PR.AC-1

### Data Protection
- **Policy**: [DP-001 Data Protection Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/DP-001.md)
- **Encryption**: AES-256-GCM for data at rest, TLS 1.3 for transit
- **Compliance**: ISO 27001:2022 A.8.24, NIST CSF PR.DS-1

### Security Headers
- **Policy**: [SC-001 Secure Configuration Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/policies/SC-001.md)
- **Headers**: CSP, HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff)
- **Compliance**: CIS Control 4.1, OWASP Top 10
```

### ✅ Good Pattern: Input Validation with ISMS Reference

```typescript
/**
 * Validate and sanitize user input to prevent XSS and injection attacks
 * ISMS Policy: SC-002 (Secure Coding Standards)
 * Compliance: OWASP Top 10 (A03:2021 - Injection)
 */
export function sanitizeUserInput(input: string): string {
  if (typeof input !== 'string') {
    throw new SecurityError('Invalid input type');
  }
  
  // Whitelist alphanumeric and safe characters
  const sanitized = input.replace(/[^a-zA-Z0-9\s\-_.@]/g, '');
  
  // Limit length to prevent DoS
  if (sanitized.length > 1000) {
    throw new SecurityError('Input exceeds maximum length');
  }
  
  return sanitized;
}
```

### ✅ Good Pattern: Dependency Security Check

```json
{
  "scripts": {
    "preinstall": "npm audit --audit-level=moderate",
    "test:security": "npm audit && npm run test:licenses",
    "test:licenses": "license-checker --onlyAllow 'MIT;Apache-2.0;BSD-3-Clause;ISC'"
  }
}
```

### ❌ Bad Pattern: No ISMS Reference

```typescript
// Bad: No security policy reference or documentation
export class AuthService {
  login(username: string, password: string) {
    // Implementation without security context
  }
}
```

### ❌ Bad Pattern: Weak Security Configuration

```typescript
// Bad: Insecure defaults, no policy reference
const sessionConfig = {
  timeout: 24 * 60 * 60 * 1000, // 24 hours - too long!
  secure: false, // Should be true in production
  httpOnly: false, // Should be true to prevent XSS
  sameSite: 'none' // Should be 'strict' or 'lax'
};
```

### ❌ Bad Pattern: Missing Input Validation

```typescript
// Bad: No validation or sanitization
export function displayUsername(username: string): void {
  document.getElementById('user').innerHTML = username; // XSS vulnerability!
}
```

### ❌ Bad Pattern: Hardcoded Secrets

```typescript
// Bad: Hardcoded credentials (violates SC-003 Secret Management Policy)
const API_KEY = "sk_live_abc123def456"; // Never hardcode secrets!
const DATABASE_PASSWORD = "admin123"; // Use environment variables!
```

## References

### ISMS Policies
- [Hack23 AB ISMS Public Repository](https://github.com/Hack23/ISMS-PUBLIC)
- [ISO 27001:2022 Controls](https://www.iso.org/isoiec-27001-information-security.html)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8)

### Security Standards
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [SANS Top 25](https://www.sans.org/top25-software-errors/)

### Tools
- `npm audit` - Dependency vulnerability scanning
- `license-checker` - License compliance verification
- Dependabot - Automated dependency updates

## Remember

- **Security is not optional**: Every feature must consider security implications and align with ISMS policies
- **Document everything**: Security decisions, threat models, and policy references must be documented
- **Defense in depth**: Implement multiple overlapping security controls
- **Fail securely**: Systems must fail to a secure state, not an insecure one
- **Assume breach**: Design systems assuming attackers will get in - limit blast radius
- **Compliance is continuous**: Security compliance is not a one-time activity but an ongoing process
- **Test security controls**: Security features must be tested as rigorously as functional features
- **Keep dependencies updated**: Regularly update dependencies to patch known vulnerabilities
- **Encrypt sensitive data**: Never store or transmit sensitive data in plaintext
- **Principle of least privilege**: Grant only the minimum permissions required
