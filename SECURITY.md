# Security Policy

## Overview

@gerync/utils is a lightweight utility library with no sensitive data handling, no network calls, and no authentication mechanisms. It primarily provides:
- Console logging utilities
- Error handling and configuration
- Object validation helpers

As such, security risks are minimal. However, we appreciate responsible disclosure.

## Reporting Security Issues

If you discover a security concern:

1. **Please do not open a public issue** on GitHub
2. Email: contact@gerync.com with details
3. Include a description of the issue and steps to reproduce (if applicable)

We'll acknowledge receipt and respond as time permits.

## Known Limitations

- This is a hobby/utility project with no guaranteed maintenance SLA
- Security updates may take time or may not happen immediately
- Users are responsible for validating their own use cases

## Best Practices for Users

- **Sanitize user input** before passing to object validation functions
- **Avoid logging sensitive data** (credentials, tokens, PII) through coloredlog
- **Configure error responses** carefully to avoid exposing internal details to clients
- **Keep dependencies updated** in your own projects

## Third-Party Dependencies

- **express**: Security maintained by the Express community
- **typescript**: Security maintained by the TypeScript team

We don't actively monitor these, but we recommend keeping them updated in your own projects.

## No Warranty

This library is provided "as-is" without warranty. See [LICENSE](LICENSE) for full details.

