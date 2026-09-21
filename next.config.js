module.exports = async (phase, context) => {
  const { default: withEveConfig } = await import("./next.config.mjs");
  return withEveConfig(phase, context);
};
