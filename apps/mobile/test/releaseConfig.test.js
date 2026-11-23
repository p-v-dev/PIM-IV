import { describe, expect, it, vi } from 'vitest';
import releaseConfig from '../app.config.js';

const config = { version: '0.1.0', android: { package: 'com.eduquest.aluno' } };

describe('Android release config', () => {
  it('keeps the app configuration outside release builds', () => {
    vi.stubEnv('EDUQUEST_RELEASE_VERSION', '');
    try {
      expect(releaseConfig({ config })).toEqual(config);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('sets a version and a monotonic Android version code', () => {
    vi.stubEnv('EDUQUEST_RELEASE_VERSION', '1.2.3');
    try {
      expect(releaseConfig({ config })).toEqual({
        version: '1.2.3',
        android: { package: 'com.eduquest.aluno', versionCode: 1002003 },
      });
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it.each(['0.0.0', '1.1000.0', '1.0.0-beta', '1.02.0'])('rejects invalid release version %s', (version) => {
    vi.stubEnv('EDUQUEST_RELEASE_VERSION', version);
    try {
      expect(() => releaseConfig({ config })).toThrow('Invalid release version');
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
