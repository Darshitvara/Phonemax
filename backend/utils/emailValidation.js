const dns = require('dns').promises;

// Minimal regex for email structure per RFC 5322 simplified
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common disposable email domains (extend as needed)
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'tempmail.io',
  'yopmail.com',
  'trashmail.com',
  'fakeinbox.com',
]);

async function hasMxRecords(domain) {
  try {
    const records = await dns.resolveMx(domain);
    return Array.isArray(records) && records.length > 0;
  } catch {
    return false;
  }
}

async function validateEmailAddress(email) {
  // Basic syntax check
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, reason: 'invalid_syntax' };
  }

  const domain = email.split('@')[1].toLowerCase();

  // Block disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'disposable_domain' };
  }

  // Check MX records to ensure domain accepts mail
  const mxOk = await hasMxRecords(domain);
  if (!mxOk) {
    return { valid: false, reason: 'no_mx_records' };
  }

  return { valid: true };
}

module.exports = {
  validateEmailAddress,
};
