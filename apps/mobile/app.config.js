module.exports = ({ config }) => {
  const version = process.env.EDUQUEST_RELEASE_VERSION;
  if (!version) return config;

  const match = /^(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})\.(0|[1-9][0-9]{0,2})$/.exec(version);
  if (!match || version === '0.0.0') throw new Error('Invalid release version');

  const [major, minor, patch] = match.slice(1).map(Number);
  return {
    ...config,
    version,
    android: { ...config.android, versionCode: major * 1_000_000 + minor * 1_000 + patch },
  };
};
