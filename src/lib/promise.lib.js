export const handlePromise = (fn) =>
  async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      const next = args[2];
      if (typeof next === "function") {
        return next(err);
      }
      throw err;
    }
  };
