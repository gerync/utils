# @gerync/utils

A collection of utilities for any type of project, providing logging, error handling, configuration management, and object manipulation helpers.

## Installation

```bash
npm install @gerync/utils
```

## Features

- **Colored Logging**: Console logging with hex, RGB, and named color support
- **Error Handler Middleware**: Express-compatible error handler with multi-language support
- **Configuration Manager**: Dynamic setup for preferences and localized response messages
- **Object Utilities**: Helper functions for object key validation and inspection

---

## API Reference

### 1. coloredlog

Log messages to the console with color support. Accepts hex, RGB, or CSS named colors. Optional bold styling works in both browser (`%c`) and Node (ANSI) consoles.

**Import:**
```typescript
import utils from '@gerync/utils';
utils.coloredlog(message, color, bold?);
```

**Usage:**
```typescript
// Named colors
utils.coloredlog('This is an error', 'red');
utils.coloredlog('This is a warning', 'orange');
utils.coloredlog('Success!', 'green');
utils.coloredlog('Bold success!', 'green', true);

// Hex colors
utils.coloredlog('Custom color', '#FF5733');
utils.coloredlog('Another shade', '#FF5733CC'); // with alpha

// RGB colors
utils.coloredlog('RGB color', 'rgb(255, 87, 51)');
utils.coloredlog('RGBA with alpha', 'rgba(255, 87, 51, 0.8)');

// If color is invalid, logs without styling
utils.coloredlog('No styling', 'invalid-color');
```

**Parameters:**
- `message` (string): The text to log
- `color` (string): A valid hex (`#XXX`, `#XXXX`, `#XXXXXX`, `#XXXXXXXX`), RGB (`rgb(r, g, b)`), RGBA (`rgba(r, g, b, a)`), or CSS named color
- `bold` (boolean, default `false`): When true, renders bold text (ANSI in Node, `font-weight` in browsers)

---

### 2. config

Manage application preferences and localized response messages.

**Import:**
```typescript
import utils from '@gerync/utils';
utils.configure({ ... });
```

**Usage:**

#### Initial Setup

```typescript
import utils from '@gerync/utils';

utils.configure({
    prefs: {
        acceptedLanguages: ['en', 'fr', 'de'],
        noDupesAllowedof: ['email', 'username', 'phone']
    },
    responses: {
        en: {
            dupes: {
                email: 'Email already exists.',
                username: 'Username is taken.',
                phone: 'Phone number is already in use.'
            },
            general: {
                error: 'An error occurred. Please try again later.'
            }
        },
        fr: {
            dupes: {
                email: 'Cet email existe déjà.',
                username: 'Ce nom d\'utilisateur est pris.',
                phone: 'Ce numéro est déjà utilisé.'
            },
            general: {
                error: 'Une erreur est survenue. Veuillez réessayer.'
            }
        }
    }
});
```

#### Retrieve Configuration

```typescript
const responses = utils.config.getResponses();
const prefs = utils.config.getPrefs();

console.log(responses['en'].dupes.email); // "Email already exists."
console.log(prefs.acceptedLanguages);     // ['en', 'fr', 'de']
```

**Methods:**
- `configure(options)`: Set preferences and responses at runtime
- `getResponses()`: Return the current response messages object
- `getPrefs()`: Return the current preferences object

---

### 3. errorHandler

Express middleware for centralized error handling with multi-language support, smart logging, and user-friendly messages.

**Import:**
```typescript
import utils from '@gerync/utils';
app.use(utils.errorHandler);
```

**Setup:**

```typescript
import express from 'express';
import utils from '@gerync/utils';

const app = express();

// Configure responses and preferences BEFORE using the middleware
utils.configure({
    prefs: {
        acceptedLanguages: ['en', 'hu', 'es'],
        noDupesAllowedof: ['email', 'username', 'phone']
    },
    responses: {
        en: {
            dupes: {
                email: 'Email address already exists.',
                username: 'Username is already taken.',
                phone: 'Phone number is already in use.'
            },
            general: {
                error: 'An internal server error occurred.'
            }
        }
    }
});

// Use the middleware at the end
app.use(utils.errorHandler);
```

**Features:**

- **Language Detection**: Detects language from `req.lang`, `req.language`, or `Accept-Language` header
- **User-Friendly Responses**: Returns localized messages to clients based on their language
- **Smart Logging**: Only logs detailed error reports for server-side issues (5xx), not user errors (4xx)
- **Multi-Colored Console Output**: Color-coded error reports for easy debugging
- **Automatic Error Classification**: Recognizes user-caused errors (validation, duplicates, etc.)

**Error Response Format:**

```json
{
    "status": 409,
    "code": "ER_DUP_ENTRY",
    "message": "Email address already exists."
}
```

**Console Output (Server Errors Only):**

```
===================== ERROR REPORT =====================
Time: 2025-12-29 19:52:09
Route: POST /api/users
RequestId: abc123def456
Status: 500
Code: DATABASE_ERROR
UserMessage: An internal server error occurred.
RawMessage: Connection timeout
Stack: Error: Connection timeout
    at Database.query (...)
    at ...
========================================================
```

**Supported Error Codes:**

User-caused (4xx):
- `BAD_REQUEST`: Malformed request
- `UNAUTHORIZED`: Auth required
- `FORBIDDEN`: Permission denied
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `METHOD_NOT_ALLOWED`
- `NOT_ACCEPTABLE`
- `UNSUPPORTED_MEDIA_TYPE`
- `PAYLOAD_TOO_LARGE`
- `UNPROCESSABLE_ENTITY`
- `TOO_MANY_REQUESTS`
- `VALIDATION_ERROR`: User input validation failure
- `ER_DUP_ENTRY`: Duplicate database entry

Server-side (5xx):
- `INTERNAL_SERVER_ERROR`: Unhandled error
- `DATABASE_ERROR`: Database operation failed
- `SERVICE_UNAVAILABLE`: Temporary service outage
- `BAD_GATEWAY`
- `GATEWAY_TIMEOUT`
- `NOT_IMPLEMENTED`
- `NETWORK_ERROR`
- `TIMEOUT`

---

### 4. object utilities

Helper functions for validating and inspecting object keys.

**Import:**
```typescript
import utils from '@gerync/utils';
const { Keysamount, KeysInRange, KeysInRangeDetailed, AllowedKeys } = utils.object;
```

#### Keysamount
Get the number of keys in an object.

```typescript
const user = { name: 'John', email: 'john@example.com', age: 30 };
const count = utils.object.Keysamount(user); // 3
```

#### KeysInRange
Check if an object has a key count within a specified range.

```typescript
const user = { name: 'John', email: 'john@example.com', age: 30 };

// Exact count
utils.object.KeysInRange(user, 3); // true
utils.object.KeysInRange(user, 2); // false

// Range check
utils.object.KeysInRange(user, 2, 5); // true (3 is between 2 and 5)
utils.object.KeysInRange(user, 4, 10); // false (3 is not between 4 and 10)
```

#### KeysInRangeDetailed
Check key count within range and return detailed status.

```typescript
const user = { name: 'John', email: 'john@example.com' };

utils.object.KeysInRangeDetailed(user, 1, 5);   // 0 (within range)
utils.object.KeysInRangeDetailed(user, 5, 10);  // -1 (below minimum)
utils.object.KeysInRangeDetailed(user, 1, 1);   // 1 (above maximum)
```

Returns:
- `0`: Key count is within range
- `-1`: Key count is below minimum
- `1`: Key count is above maximum

#### AllowedKeys
Validate that an object contains only allowed keys, with required and optional key support.

```typescript
const createUserPayload = { name: 'John', email: 'john@example.com' };
const updateUserPayload = { name: 'Jane' };

// Required keys: name, email
// Optional keys: phone, bio
const requiredKeys = ['name', 'email'];
const optionalKeys = ['phone', 'bio'];

utils.object.AllowedKeys(createUserPayload, requiredKeys, optionalKeys);  // true
utils.object.AllowedKeys(updateUserPayload, requiredKeys, optionalKeys);  // false (missing email)

// All keys in object must be allowed
const invalidPayload = { name: 'John', email: 'john@example.com', admin: true };
utils.object.AllowedKeys(invalidPayload, requiredKeys, optionalKeys);     // false (admin not allowed)
```

**Parameters:**
- `obj` (Record<string, any>): Object to validate
- `keys` (string[]): Required keys that must be present
- `optionalKeys` (string[], default `[]`): Optional keys that may be present

**Returns:** `true` if validation passes, `false` otherwise

---

## Complete Example

```typescript
import express from 'express';
import utils from '@gerync/utils';

const app = express();

// Setup Config
utils.configure({
    prefs: {
        acceptedLanguages: ['en', 'es'],
        noDupesAllowedof: ['email', 'username']
    },
    responses: {
        en: {
            dupes: {
                email: 'Email already exists.',
                username: 'Username is taken.'
            },
            general: {
                error: 'An error occurred.'
            }
        },
        es: {
            dupes: {
                email: 'El email ya existe.',
                username: 'El nombre de usuario ya está en uso.'
            },
            general: {
                error: 'Ocurrió un error.'
            }
        }
    }
});

app.use(express.json());

// Routes
app.post('/users', (req, res, next) => {
    try {
        // Validate request payload
        const requiredKeys = ['name', 'email'];
        const optionalKeys = ['phone'];

        if (!utils.object.AllowedKeys(req.body, requiredKeys, optionalKeys)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid request payload'
            });
        }

        utils.coloredlog(`User creation requested: ${req.body.email}`, 'cyan');

        // Simulate user creation
        const user = { id: 1, ...req.body };
        res.json(user);
    } catch (error) {
        next(error);
    }
});

// Error handler middleware (must be last)
app.use(utils.errorHandler);

app.listen(3000, () => {
    utils.coloredlog('Server running on port 3000', 'green');
});
```

---

## License

This project is licensed under the MIT License.

- Permissions: Commercial use, modification, distribution, private use
- Conditions: Include copyright and license notices
- Limitations: No warranty; authors are not liable for damages

See the full license text in [LICENSE](LICENSE).
