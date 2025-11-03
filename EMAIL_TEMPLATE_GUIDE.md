# Base Email Template - Usage Guide

## Overview

The base email template system provides a consistent, maintainable approach to email design across the application. It eliminates code duplication and makes it easy to update the email design globally.

## Features

- ✅ **Consistent Design**: All emails use the same header, footer, and styling
- ✅ **Responsive**: Mobile-optimized layouts
- ✅ **Security**: Built-in HTML escaping to prevent XSS
- ✅ **Maintainability**: Change design once, update all emails
- ✅ **Preheader Support**: Optional preview text for email clients
- ✅ **Pre-styled Components**: Alert boxes, info boxes, code boxes, success boxes

## Files

- **Base Template**: `src/services/email/templates/base.template.js`
- **Examples**: `registration.template.js`, `request.template.js`

## How to Use

### 1. Import the Base Template

```javascript
import { baseEmailTemplate, escapeHtml } from './base.template.js';
```

### 2. Create Your Email Content

```javascript
export const myEmailTemplate = (userName, otherData) => {
  // Always escape user input
  const safeUserName = escapeHtml(userName);
  const appName = escapeHtml(process.env.APP_NAME || 'Lotería');

  // Build your content HTML
  const content = `
    <h2>Welcome ${safeUserName}!</h2>
    
    <p>Your personalized message here...</p>

    <div class="info-box">
      <p>Some important information</p>
    </div>

    <p style="margin-top: 30px">
      Saludos,<br /><strong>El equipo de ${appName}</strong>
    </p>
  `;

  // Return the complete email using the base template
  return baseEmailTemplate({
    title: `Email Title - ${appName}`,
    content,
    preheader: 'Optional preview text shown in email clients',
  });
};
```

## Available CSS Classes

The base template includes these pre-styled classes:

### Info Box
```html
<div class="info-box">
  <div class="info-row">
    <span class="info-label">Label:</span>
    <span class="info-value">Value</span>
  </div>
</div>
```

### Alert Box (Warning)
```html
<div class="alert-box">
  <p><strong>Warning:</strong> Important message here</p>
</div>
```

### Success Box
```html
<div class="success-box">
  <p><strong>Success:</strong> Operation completed</p>
</div>
```

### Code Box (for verification codes)
```html
<div class="code-box">
  <div class="code-value">123456</div>
  <p style="margin-top: 15px; font-size: 13px; color: #9ca3af;">
    Expires in 15 minutes
  </p>
</div>
```

### Lists
```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

## Before & After Comparison

### Before (189 lines)
```javascript
export const plantillaRegistro = (nombre) => {
  return `
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Bienvenido a ${process.env.APP_NAME}</title>
      <style>
        /* 150+ lines of CSS */
      </style>
    </head>
    <body>
      <!-- Header, content, footer all inline -->
    </body>
  </html>
  `;
};
```

### After (48 lines)
```javascript
import { baseEmailTemplate, escapeHtml } from './base.template.js';

export const plantillaRegistro = (nombre) => {
  const nombreSeguro = escapeHtml(nombre);
  const appName = escapeHtml(process.env.APP_NAME || 'Lotería');

  const content = `
    <p>Hola ${nombreSeguro},</p>
    <!-- Just the content -->
  `;

  return baseEmailTemplate({
    title: `Bienvenido a ${appName}`,
    content,
  });
};
```

**Result**: 74% reduction in code size!

## Migration Steps

To migrate an existing email template:

1. **Import the base template**
   ```javascript
   import { baseEmailTemplate, escapeHtml } from './base.template.js';
   ```

2. **Extract just the content section** (everything between `<div class="content">` and `</div>`)

3. **Remove all HTML structure** (doctype, head, body, header, footer)

4. **Remove all CSS** (it's already in the base template)

5. **Replace inline `escapeHtml` function** with the imported one

6. **Wrap content in baseEmailTemplate call**

7. **Test the email** to ensure it looks correct

## Security Best Practices

Always escape user input:

```javascript
// ✅ CORRECT
const safeName = escapeHtml(userName);
const content = `<p>Hello ${safeName}</p>`;

// ❌ WRONG - XSS vulnerability!
const content = `<p>Hello ${userName}</p>`;
```

## Customization

### Change Colors

Edit `base.template.js` and modify the CSS:

```css
.header {
  background-color: #ff6b35; /* Change this */
}
```

### Add New Components

Add new CSS classes to the `<style>` section in `base.template.js`:

```css
.my-custom-box {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
}
```

## Examples

See these files for working examples:
- `src/services/email/templates/registration.template.js` - Simple welcome email
- `src/services/email/templates/request.template.js` - Email with code box and security tips

## Benefits Summary

✅ **Reduced duplication**: ~1000+ lines of duplicated code eliminated  
✅ **Easier maintenance**: Update design once, affects all emails  
✅ **Consistent branding**: Same look and feel across all communications  
✅ **Better security**: Centralized HTML escaping  
✅ **Faster development**: Create new emails in minutes, not hours  

## Next Steps

To complete the migration, apply the same pattern to the remaining 8 email templates:
- change-password.template.js
- account-credentials.template.js
- buy-ticket.template.js
- deposit-balance.template.js
- withdraw-balance.template.js
- prize-won.template.js
- draw-result.template.js
- reset-password.template.js

Each template should follow the same pattern shown in the examples above.
