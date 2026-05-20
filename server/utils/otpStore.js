/**
 * OTP Store — in-memory with automatic expiry cleanup.
 *
 * Production upgrade path:
 *   Replace this module with an ioredis-backed store.
 *   The interface (get/set/delete) stays the same.
 */

const store = new Map();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

/** Generate a 6-digit OTP */
export const generateOTP = () =>
  String(Math.floor(100000 + Math.random() * 900000));

/** Store a new OTP for (employeeId, email) pair */
export const setOTP = (employeeId, email, userId) => {
  const key = `${employeeId}::${email}`;
  const otp = generateOTP();
  store.set(key, {
    otp,
    userId,
    email,
    employeeId,
    expires: Date.now() + OTP_TTL_MS,
    attempts: 0,
    verified: false,
  });
  return otp;
};

/** Retrieve OTP record; returns null if not found or expired */
export const getOTP = (employeeId, email) => {
  const key = `${employeeId}::${email}`;
  const record = store.get(key);
  if (!record) return null;
  if (Date.now() > record.expires) {
    store.delete(key);
    return null;
  }
  return record;
};

/** Mark OTP as verified */
export const markVerified = (employeeId, email) => {
  const key = `${employeeId}::${email}`;
  const record = store.get(key);
  if (record) {
    record.verified = true;
    store.set(key, record);
  }
};

/** Increment failed attempt counter; returns remaining attempts */
export const incrementAttempt = (employeeId, email) => {
  const key = `${employeeId}::${email}`;
  const record = store.get(key);
  if (!record) return 0;
  record.attempts += 1;
  store.set(key, record);
  return MAX_ATTEMPTS - record.attempts;
};

/** Returns true if attempt limit is reached */
export const isLocked = (employeeId, email) => {
  const record = getOTP(employeeId, email);
  return record ? record.attempts >= MAX_ATTEMPTS : false;
};

/** Delete OTP after successful use */
export const deleteOTP = (employeeId, email) => {
  store.delete(`${employeeId}::${email}`);
};

// ─── Cleanup expired OTPs every minute ───────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.expires) {
      store.delete(key);
    }
  }
}, 60_000);
