import { describe, expect, test } from 'vitest';
import { navLinks } from '~/lib/nav-links';

describe('Tester navigasjonslenkene', () => {
  test('Temasider-lenken peker på listen, ikke på «ny»-skjemaet', () => {
    const temasider = navLinks.find((lenke) => lenke.text === 'Temasider');
    expect(temasider?.address).toBe('/temasider');
  });
});
