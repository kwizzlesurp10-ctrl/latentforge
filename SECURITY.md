# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in LatentForge, please report it responsibly:

1. **Do NOT open a public GitHub issue**
2. **Email security concerns** to the repository owner
3. **Include detailed steps** to reproduce the vulnerability
4. **Allow 48-72 hours** for initial response

We take security seriously and will respond promptly to legitimate reports.

---

## Security Best Practices

### For Users

- **Keep dependencies updated**: Run `npm update` regularly
- **Review permissions**: Be cautious when installing from forks
- **Use strong GitHub auth**: Enable 2FA on your GitHub account
- **Don't commit secrets**: Never push API keys or tokens to the repository
- **Review exports**: Check generated content before sharing publicly

### For Developers

- **Validate all inputs**: Sanitize user input before processing
- **Use environment variables**: Never hardcode sensitive values
- **Follow least privilege**: Request only necessary permissions
- **Audit dependencies**: Regularly check for known vulnerabilities
- **Secure API calls**: Use HTTPS and validate responses

---

## Data Privacy

LatentForge is designed with privacy-first principles:

### What We Store

- **Vault content**: Stored in Spark KV (encrypted at rest)
- **Canvas state**: Node positions and connections
- **User preferences**: Theme, sidebar state, dismissed banners
- **Version history**: Snapshots of vault items for undo/redo

### What We DON'T Store

- ❌ No third-party analytics or tracking
- ❌ No user behavior telemetry
- ❌ No advertising identifiers
- ❌ No data sold to third parties

### Where Your Data Lives

- **Spark KV Store**: Primary storage (GitHub-secured)
- **Browser LocalStorage**: PWA install preferences only
- **IndexedDB**: Offline cache (can be cleared anytime)

---

## Authentication & Authorization

### GitHub OAuth (via Spark)

- **Scopes requested**: Read user profile, repository access (if needed for exports)
- **Token storage**: Handled securely by Spark runtime
- **Token expiration**: Automatic refresh managed by Spark
- **Revocation**: Revoke access anytime via GitHub Settings → Applications

### Row-Level Security

- **User isolation**: Each user's vault is isolated in Spark KV
- **No cross-user access**: Data cannot be accessed by other users
- **Owner-only modifications**: Only the vault owner can edit/delete

---

## Secure Development Checklist

When contributing code:

- [ ] No hardcoded secrets or API keys
- [ ] Input validation on all user-provided data
- [ ] Proper error handling (no stack traces exposed to users)
- [ ] Dependencies audited (`npm audit`)
- [ ] TypeScript strict mode enabled
- [ ] XSS protection (React escaping + CSP headers)
- [ ] CSRF protection on state-changing operations
- [ ] Secure headers in production deployment

---

## Dependency Management

### Automated Scans

- **GitHub Dependabot**: Automatically opens PRs for security updates
- **npm audit**: Run locally with `npm audit`
- **Snyk** (optional): Additional vulnerability scanning

### Manual Review

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (where possible)
npm audit fix

# Review high-severity issues
npm audit --production --audit-level=high
```

---

## Content Security Policy (CSP)

Recommended CSP headers for production deployment:

```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.github.com;
```

**Note**: Adjust based on your specific deployment requirements.

---

## Rate Limiting

### AI API Calls

- Spark LLM API has built-in rate limiting
- Implement client-side throttling for user actions
- Show loading states to prevent duplicate requests

### Export Operations

- Debounce rapid export requests
- Cache export results where applicable
- Implement exponential backoff for retries

---

## Incident Response

If a security incident occurs:

1. **Immediate containment**: Disable affected features
2. **User notification**: Inform affected users within 24 hours
3. **Root cause analysis**: Investigate and document the vulnerability
4. **Patch release**: Deploy fix as soon as possible
5. **Post-mortem**: Public disclosure after users are secured

---

## Compliance

### GDPR (European Users)

- **Right to access**: Users can export all vault data as JSON
- **Right to deletion**: Users can clear vault data anytime
- **Right to portability**: JSON exports are machine-readable
- **Data minimization**: We collect only essential data

### CCPA (California Users)

- **Disclosure**: No personal data sold to third parties
- **Opt-out**: Users can revoke GitHub OAuth anytime
- **Data deletion**: Available via vault clear function

---

## Third-Party Services

### Spark Platform

- **Provider**: GitHub
- **Data processed**: GitHub user profile, vault data
- **Security**: GitHub's security infrastructure
- **Privacy policy**: [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

### Google Fonts

- **Provider**: Google
- **Data processed**: Font file requests (IP address)
- **Privacy policy**: [Google Privacy Policy](https://policies.google.com/privacy)
- **Mitigation**: Fonts are cached by service worker after first load

---

## Security Updates

This security policy is reviewed and updated:

- **Monthly**: Dependency vulnerability scans
- **Quarterly**: Security best practices review
- **Annually**: Full security audit (if resources permit)

---

## Contact

For security concerns:
- **GitHub**: Open a private security advisory
- **Email**: [Contact repository owner via GitHub profile]

For general questions:
- **GitHub Discussions**: Community support
- **GitHub Issues**: Bug reports and feature requests

---

**Last updated**: 2025-01-01

