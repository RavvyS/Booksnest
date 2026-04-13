import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock ScrollReveal
global.ScrollReveal = vi.fn().mockReturnValue({
  reveal: vi.fn(),
});

// Mock matchMedia
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};
