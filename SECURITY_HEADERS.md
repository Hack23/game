<p align="center">
  <img src="https://hack23.github.io/cia-compliance-manager/icon-192.png" alt="Hack23 AB Logo" width="192" height="192">
</p>

<h1 align="center">🛡️ Hack23 AB — Security Headers Implementation</h1>

<p align="center">
  <strong>🔒 Technical Security Controls</strong><br>
  <em>🎯 Implementing defense-in-depth for client-side applications</em>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Owner-CEO-0A66C2?style=for-the-badge" alt="Owner"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Version-1.0-555?style=for-the-badge" alt="Version"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Effective-2025--11--10-success?style=for-the-badge" alt="Effective Date"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Review-Quarterly-orange?style=for-the-badge" alt="Review Cycle"/></a>
</p>

**📋 Document Owner:** CEO | **📄 Version:** 1.0 | **📅 Last Updated:** 2025-11-10 (UTC)  
**🔄 Review Cycle:** Quarterly | **⏰ Next Review:** 2026-02-10

---

# Security Headers Implementation

## Overview
This document explains the security headers implemented to address vulnerabilities identified in the ZAP (Zed Attack Proxy) full scan, in compliance with [Hack23 AB's ISMS](https://github.com/Hack23/ISMS-PUBLIC) [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md).

## Background
GitHub Pages does not support custom HTTP headers, so security controls must be implemented through HTML meta tags with `http-equiv` attributes. While not as robust as HTTP headers, these meta tags provide meaningful security improvements for client-side rendered applications.

This implementation aligns with:
- **[Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md)** - Security testing and DAST requirements
- **[Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md)** - Security controls implementation

## Implemented Security Headers

### 1. Content Security Policy (CSP)
**Meta Tag:**
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
```

**Purpose:** Restricts the sources from which various types of content can be loaded.

**Directives Explained:**
- `default-src 'self'` - Only load resources from same origin by default
- `script-src 'self'` - Only execute scripts from same origin
- `style-src 'self' 'unsafe-inline'` - Allow same-origin styles and inline styles (required by React)
- `img-src 'self' data: blob:` - Allow images from same origin, data URIs, and blob URLs (required by Three.js)
- `font-src 'self'` - Only load fonts from same origin
- `connect-src 'self'` - Only allow connections to same origin
- `media-src 'self' blob:` - Allow media from same origin and blob URLs (required by audio)
- `worker-src 'self' blob:` - Allow web workers from same origin and blob URLs
- `frame-ancestors 'none'` - Prevent page from being embedded in frames (clickjacking protection)
- `base-uri 'self'` - Restrict base tag URLs to same origin
- `form-action 'self'` - Restrict form submission targets to same origin

**ZAP Issues Addressed:**
- ✅ Content Security Policy (CSP) Header Not Set [10038]
- ✅ CSP: Failure to Define Directive with No Fallback [10055]
- ✅ CSP: style-src unsafe-inline [10055] (acceptable for React applications)

### 2. X-Frame-Options
**Meta Tag:**
```html
<meta http-equiv="X-Frame-Options" content="DENY" />
```

**Purpose:** Prevents the page from being displayed in a frame, iframe, embed, or object tag.

**ZAP Issues Addressed:**
- ✅ Missing Anti-clickjacking Header [10020]

### 3. X-Content-Type-Options
**Meta Tag:**
```html
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
```

**Purpose:** Prevents browsers from MIME-sniffing responses, reducing exposure to drive-by download attacks.

**ZAP Issues Addressed:**
- ✅ X-Content-Type-Options Header Missing [10021]

### 4. Referrer Policy
**Meta Tag:**
```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

**Purpose:** Controls how much referrer information is included with requests.

**Policy Explained:**
- Same-origin requests: Full URL sent as referrer
- Cross-origin HTTPS requests: Only origin sent as referrer
- HTTPS→HTTP requests: No referrer sent

### 5. X-XSS-Protection
**Meta Tag:**
```html
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

**Purpose:** Enables the Cross-Site Scripting (XSS) filter built into most browsers.

**Note:** Modern browsers have deprecated this header in favor of CSP, but it's included for older browser support.

### 6. Permissions Policy
**Meta Tag:**
```html
<meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" />
```

**Purpose:** Controls which browser features and APIs can be used in the document.

**Features Disabled:**
- Geolocation API
- Microphone access
- Camera access
- Payment Request API
- USB device access
- Magnetometer
- Gyroscope
- Accelerometer

### 7. Cross-Origin Policies
**Meta Tags:**
```html
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
<meta http-equiv="Cross-Origin-Resource-Policy" content="same-origin" />
```

**Purpose:** Mitigates Spectre-style attacks by isolating the browsing context.

**Policies Explained:**
- `Cross-Origin-Opener-Policy: same-origin` - Isolates the browsing context to same-origin documents only
- `Cross-Origin-Resource-Policy: same-origin` - Prevents other origins from reading the resource

**ZAP Issues Addressed:**
- ✅ Insufficient Site Isolation Against Spectre Vulnerability [90004]

## ZAP Issues Not Fully Addressable via Meta Tags

### Strict-Transport-Security (HSTS)
**Issue:** Strict-Transport-Security Header Not Set [10035]

**Status:** ⚠️ Partially Addressed

**Explanation:** The `Strict-Transport-Security` header cannot be set via meta tags. However:
1. GitHub Pages serves all content over HTTPS by default
2. GitHub Pages automatically redirects HTTP requests to HTTPS
3. The security benefit is largely achieved through GitHub's infrastructure

**Recommendation:** This is acceptable for GitHub Pages deployments as the infrastructure enforces HTTPS.

### CORS Misconfiguration
**Issue:** CORS Misconfiguration [40040]

**Status:** ⚠️ Infrastructure Level

**Explanation:** CORS headers must be set by the server and cannot be controlled via HTML meta tags. For GitHub Pages:
1. GitHub Pages sets appropriate CORS headers
2. All resources are served from the same origin
3. No cross-origin resource sharing is required for this application

**Recommendation:** No action needed as the application doesn't require CORS.

## Testing
All security headers are validated by automated tests in `src/test/security-headers.test.ts`:
- ✅ 11 security header tests
- ✅ Validates presence of all meta tags
- ✅ Verifies correct content values
- ✅ Ensures React and Three.js compatibility

## Verification
To verify the security headers are present:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Check the output:**
   ```bash
   cat dist/index.html | grep "http-equiv"
   ```

3. **Run security tests:**
   ```bash
   npm run test -- src/test/security-headers.test.ts
   ```

## Browser Compatibility
Meta tags with `http-equiv` are supported by:
- ✅ Chrome/Edge (all modern versions)
- ✅ Firefox (all modern versions)
- ✅ Safari (all modern versions)
- ✅ Mobile browsers

**Note:** While not as strong as HTTP headers, these meta tags provide meaningful security improvements for browsers that respect them.

## Future Improvements
If migrating from GitHub Pages to a platform with HTTP header support (e.g., Netlify, Vercel):
1. Convert meta tags to HTTP headers
2. Add `Strict-Transport-Security` header with appropriate max-age
3. Consider adding `Content-Security-Policy-Report-Only` for monitoring
4. Implement proper CORS configuration if needed

---

## 📚 Related Documents

### Internal Documentation
- 🔒 [SECURITY.md](SECURITY.md) - Security policy and vulnerability reporting
- 📊 [ISMS Policy Mapping](docs/ISMS_POLICY_MAPPING.md) - Feature-to-policy mapping
- 📖 [README.md](README.md) - Project overview

### ISMS-PUBLIC Policies
- 🔐 [Information Security Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Information_Security_Policy.md) - Overall security governance
- 🛠️ [Secure Development Policy](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Secure_Development_Policy.md) - SDLC and security testing requirements
- 🔍 [Vulnerability Management](https://github.com/Hack23/ISMS-PUBLIC/blob/main/Vulnerability_Management.md) - Security vulnerability handling
- 🏷️ [Classification Framework](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) - CIA triad and impact levels

### External References
- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP: Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)
- [OWASP: Security Headers](https://owasp.org/www-project-secure-headers/)
- [ZAP Scanning Rules](https://www.zaproxy.org/docs/alerts/)

---

**📋 Document Control:**  
**✅ Approved by:** James Pether Sörling, CEO  
**📤 Distribution:** Public  
**🏷️ Classification:** [![Confidentiality: Public](https://img.shields.io/badge/C-Public-lightgrey?style=flat-square)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md#confidentiality-levels)  
**📅 Effective Date:** 2025-11-10  
**⏰ Next Review:** 2026-02-10  
**🎯 Framework Compliance:** [![ISO 27001](https://img.shields.io/badge/ISO_27001-2022_Aligned-blue?style=flat-square&logo=iso&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![NIST CSF 2.0](https://img.shields.io/badge/NIST_CSF-2.0_Aligned-green?style=flat-square&logo=nist&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![CIS Controls](https://img.shields.io/badge/CIS_Controls-v8.1_Aligned-orange?style=flat-square&logo=cisecurity&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md) [![OWASP](https://img.shields.io/badge/OWASP-Aligned-purple?style=flat-square&logo=owasp&logoColor=white)](https://github.com/Hack23/ISMS-PUBLIC/blob/main/CLASSIFICATION.md)
