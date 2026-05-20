/**
 * Validates that all required environment variables are present.
 * Call this once at server startup before anything else.
 */
const REQUIRED_VARS = ["MONGO_URI", "JWT_SECRET"];

export const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
    console.error("   Copy .env.example to .env and fill in the values.");
    process.exit(1);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error("❌ JWT_SECRET must be at least 32 characters long.");
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production") {
    if (process.env.ALLOWED_ORIGINS?.includes("localhost")) {
      console.warn("⚠️  WARNING: ALLOWED_ORIGINS contains localhost in production mode.");
    }
  }

  console.log("✅ Environment variables validated.");
};
