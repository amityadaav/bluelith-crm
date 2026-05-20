/**
 * Wraps an async route handler and forwards any rejected promises to next().
 * Eliminates the try/catch boilerplate in every controller.
 *
 * Usage:  router.get("/", asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
