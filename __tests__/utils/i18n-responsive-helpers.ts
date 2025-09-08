/**
 * Internationalization (i18n) responsive testing utilities
 * Specialized testing for German language layouts and text expansion handling
 */

import { vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ReactElement, ReactNode, createElement } from 'react';
import { ViewportName, ResponsiveTestEnvironment } from './responsive-test-helpers';

// German language layout constants
export const GERMAN_LAYOUT_CONFIG = {
  textExpansionFactor: 1.3, // German text is typically 30% longer than English
  maxExpansionFactor: 1.5, // Maximum expected expansion (50%)
  minLineHeight: 1.2, // Minimum line height for German text readability
  preferredLineHeight: 1.5, // Preferred line height for optimal readability
  maxLineLength: 70, // Maximum characters per line for readability
} as const;

// Common German translations that tend to be longer
export const GERMAN_TEXT_SAMPLES = {
  navigation: {
    en: 'Home',
    de: 'Startseite',
  },
  buttons: {
    en: 'Learn More',
    de: 'Mehr erfahren',
  },
  labels: {
    en: 'Contact Information',
    de: 'Kontaktinformationen',
  },
  descriptions: {
    en: 'Web Development Services',
    de: 'Webentwicklungsdienstleistungen',
  },
  longText: {
    en: 'Professional web development and design services for modern businesses.',
    de: 'Professionelle Webentwicklungs- und Designdienstleistungen für moderne Unternehmen.',
  },
} as const;

/**
 * Mock language provider for testing
 */
export function createMockLanguageProvider(language: 'de' | 'en' = 'de') {
  return function MockLanguageProvider({ children }: { children: ReactNode }) {
    // Mock language context - in real implementation, this would provide actual translations
    const mockContext = {
      currentLanguage: language,
      dictionary: language === 'de' 
        ? Object.fromEntries(Object.entries(GERMAN_TEXT_SAMPLES).map(([key, value]) => [key, value.de]))
        : Object.fromEntries(Object.entries(GERMAN_TEXT_SAMPLES).map(([key, value]) => [key, value.en])),
    };

    // Mock the useLanguage hook
    vi.doMock('@/contexts/LanguageContext', () => ({
      useLanguage: () => mockContext,
      LanguageProvider: ({ children }: { children: ReactNode }) => children,
    }));

    return createElement('div', null, children);
  };
}

/**
 * Test component with both German and English languages
 */
export async function testWithBothLanguages(
  component: ReactElement,
  testFn: (language: 'de' | 'en') => Promise<void> | void,
  viewports: ViewportName[] = ['mobile', 'tablet', 'desktop']
): Promise<{ de: boolean; en: boolean; details: Array<{ language: 'de' | 'en'; viewport: ViewportName; success: boolean; error?: string }> }> {
  const env = new ResponsiveTestEnvironment();
  const results: Array<{ language: 'de' | 'en'; viewport: ViewportName; success: boolean; error?: string }> = [];

  for (const language of ['de', 'en'] as const) {
    for (const viewport of viewports) {
      try {
        env.setViewport(viewport);
        
        const MockLanguageProvider = createMockLanguageProvider(language);
        const { unmount } = render(
          createElement(MockLanguageProvider, null, component)
        );

        await waitFor(() => {});
        await testFn(language);

        results.push({ language, viewport, success: true });
        unmount();
      } catch (error) {
        results.push({
          language,
          viewport,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  env.cleanup();

  const deResults = results.filter(r => r.language === 'de');
  const enResults = results.filter(r => r.language === 'en');

  return {
    de: deResults.every(r => r.success),
    en: enResults.every(r => r.success),
    details: results,
  };
}

/**
 * Validate text expansion doesn't break layout
 */
export function validateTextExpansionHandling(
  container: HTMLElement,
  // expectedExpansion: number = GERMAN_LAYOUT_CONFIG.textExpansionFactor
): {
  valid: boolean;
  issues: Array<{
    element: Element;
    issue: 'overflow' | 'truncation' | 'poor-spacing';
    details: string;
  }>;
} {
  const issues: Array<{
    element: Element;
    issue: 'overflow' | 'truncation' | 'poor-spacing';
    details: string;
  }> = [];

  // Find text elements that might be affected by expansion
  const textElements = container.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, span, button, a, label, [role="button"]'
  );

  textElements.forEach(element => {
    const computedStyle = getComputedStyle(element as HTMLElement);
    const rect = element.getBoundingClientRect();
    
    // Check for text overflow
    if (computedStyle.overflow === 'hidden' && computedStyle.textOverflow === 'ellipsis') {
      const scrollWidth = (element as HTMLElement).scrollWidth;
      if (scrollWidth > rect.width) {
        issues.push({
          element,
          issue: 'truncation',
          details: `Text is truncated: scroll width ${scrollWidth}px > display width ${rect.width}px`,
        });
      }
    }

    // Check for horizontal overflow beyond container
    const parent = element.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      if (rect.right > parentRect.right + 5) { // 5px tolerance
        issues.push({
          element,
          issue: 'overflow',
          details: `Element overflows parent: ${rect.right}px > ${parentRect.right}px`,
        });
      }
    }

    // Check line height for readability
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeightRatio = lineHeight / fontSize;

    if (lineHeightRatio < GERMAN_LAYOUT_CONFIG.minLineHeight) {
      issues.push({
        element,
        issue: 'poor-spacing',
        details: `Line height too small: ${lineHeightRatio.toFixed(2)} < ${GERMAN_LAYOUT_CONFIG.minLineHeight}`,
      });
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Test component with progressively longer German text
 */
export async function testTextLengthScaling(
  component: ReactElement,
  textLengths: Array<{ factor: number; description: string }> = [
    { factor: 1.0, description: 'Normal length' },
    { factor: 1.3, description: 'Typical German expansion' },
    { factor: 1.5, description: 'Maximum expected expansion' },
    { factor: 2.0, description: 'Stress test' },
  ],
  viewport: ViewportName = 'mobile'
): Promise<Array<{ factor: number; valid: boolean; issues: string[] }>> {
  const env = new ResponsiveTestEnvironment();
  const results: Array<{ factor: number; valid: boolean; issues: string[] }> = [];

  env.setViewport(viewport);

  for (const { factor } of textLengths) {
    try {
      // Mock longer text content
      const mockLongText = 'A'.repeat(Math.floor(20 * factor)); // Simulate text of various lengths
      
      const { container, unmount } = render(component);
      
      // Replace text content with scaled versions
      const textElements = container.querySelectorAll('h1, h2, h3, p, button, span');
      textElements.forEach(element => {
        if (element.textContent && element.textContent.trim()) {
          element.textContent = element.textContent + ' ' + mockLongText;
        }
      });

      await waitFor(() => {});
      
      const validation = validateTextExpansionHandling(container);
      
      results.push({
        factor,
        valid: validation.valid,
        issues: validation.issues.map(issue => `${issue.issue}: ${issue.details}`),
      });

      unmount();
    } catch (error) {
      results.push({
        factor,
        valid: false,
        issues: [`Error during test: ${error instanceof Error ? error.message : String(error)}`],
      });
    }
  }

  env.cleanup();
  return results;
}

/**
 * Validate German typography and readability
 */
export function validateGermanTypography(container: HTMLElement): {
  score: number; // 0-100 readability score
  recommendations: string[];
  issues: Array<{
    element: Element;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>;
} {
  const issues: Array<{
    element: Element;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }> = [];
  const recommendations: string[] = [];

  const textElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');

  textElements.forEach(element => {
    const computedStyle = getComputedStyle(element as HTMLElement);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const fontFamily = computedStyle.fontFamily;

    // Check font size for mobile readability
    if (window.innerWidth <= 768 && fontSize < 14) {
      issues.push({
        element,
        severity: 'warning',
        message: `Font size ${fontSize}px may be too small for mobile German text`,
      });
    }

    // Check line height
    const lineHeightRatio = lineHeight / fontSize;
    if (lineHeightRatio < GERMAN_LAYOUT_CONFIG.minLineHeight) {
      issues.push({
        element,
        severity: 'error',
        message: `Line height ratio ${lineHeightRatio.toFixed(2)} is below recommended ${GERMAN_LAYOUT_CONFIG.minLineHeight}`,
      });
    }

    // Check for appropriate font family for German text
    if (!fontFamily.toLowerCase().includes('inter') && !fontFamily.includes('system')) {
      issues.push({
        element,
        severity: 'info',
        message: `Consider using Inter font or system fonts for better German character support`,
      });
    }

    // Check text width for readability
    const rect = element.getBoundingClientRect();
    const approximateCharsPerLine = Math.floor(rect.width / (fontSize * 0.6)); // Rough estimation

    if (approximateCharsPerLine > GERMAN_LAYOUT_CONFIG.maxLineLength) {
      issues.push({
        element,
        severity: 'warning',
        message: `Line length may be too long (≈${approximateCharsPerLine} chars) for optimal readability`,
      });
      recommendations.push('Consider limiting line length to 70 characters for better readability');
    }
  });

  // Generate readability score
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  const score = Math.max(0, 100 - (errorCount * 20) - (warningCount * 10) - (infoCount * 5));

  // Add general recommendations
  if (recommendations.length === 0) {
    recommendations.push('German typography looks good!');
  }

  return {
    score,
    recommendations: Array.from(new Set(recommendations)), // Remove duplicates
    issues,
  };
}

/**
 * Test component with real German content samples
 */
export async function testWithGermanContent(
  component: ReactElement,
  // contentType: keyof typeof GERMAN_TEXT_SAMPLES = 'longText',
  viewports: ViewportName[] = ['mobile', 'tablet', 'desktop']
): Promise<{
  results: Array<{
    viewport: ViewportName;
    typographyScore: number;
    layoutValid: boolean;
    issues: string[];
  }>;
  overallScore: number;
}> {
  const env = new ResponsiveTestEnvironment();
  const results: Array<{
    viewport: ViewportName;
    typographyScore: number;
    layoutValid: boolean;
    issues: string[];
  }> = [];

  for (const viewport of viewports) {
    env.setViewport(viewport);

    const MockLanguageProvider = createMockLanguageProvider('de');
    const { container, unmount } = render(
      createElement(MockLanguageProvider, null, component)
    );

    await waitFor(() => {});

    // Test typography
    const typographyResult = validateGermanTypography(container);
    
    // Test layout with text expansion
    const expansionResult = validateTextExpansionHandling(container);

    results.push({
      viewport,
      typographyScore: typographyResult.score,
      layoutValid: expansionResult.valid,
      issues: [
        ...typographyResult.issues.map(i => `${i.severity}: ${i.message}`),
        ...expansionResult.issues.map(i => `${i.issue}: ${i.details}`),
      ],
    });

    unmount();
  }

  env.cleanup();

  // Calculate overall score
  const averageTypographyScore = results.reduce((sum, r) => sum + r.typographyScore, 0) / results.length;
  const layoutValidCount = results.filter(r => r.layoutValid).length;
  const layoutScore = (layoutValidCount / results.length) * 100;
  const overallScore = (averageTypographyScore + layoutScore) / 2;

  return {
    results,
    overallScore,
  };
}

/**
 * Custom matchers for i18n testing
 */
export const i18nMatchers = {
  toHandleGermanTextExpansion: (
    received: HTMLElement,
    _maxExpansionFactor: number = GERMAN_LAYOUT_CONFIG.maxExpansionFactor
  ) => {
    const result = validateTextExpansionHandling(received);
    
    if (result.valid) {
      return {
        message: () => `Expected element to have text expansion issues`,
        pass: true,
      };
    } else {
      const issueMessages = result.issues.map(issue => 
        `${issue.element.tagName.toLowerCase()}: ${issue.details}`
      );
      
      return {
        message: () => 
          `Expected element to handle German text expansion properly:\n${issueMessages.join('\n')}`,
        pass: false,
      };
    }
  },

  toHaveGoodGermanTypography: (
    received: HTMLElement,
    minScore: number = 80
  ) => {
    const result = validateGermanTypography(received);
    
    if (result.score >= minScore) {
      return {
        message: () => `Expected German typography to have poor readability (score: ${result.score})`,
        pass: true,
      };
    } else {
      const issueMessages = result.issues
        .filter(i => i.severity === 'error' || i.severity === 'warning')
        .map(i => `${i.severity}: ${i.message}`)
        .join('\n');
      
      return {
        message: () => 
          `Expected German typography score to be at least ${minScore}, got ${result.score}:\n${issueMessages}`,
        pass: false,
      };
    }
  },

  toWorkInBothLanguages: async (
    received: ReactElement,
    testFn: (language: 'de' | 'en') => Promise<void> | void
  ) => {
    const result = await testWithBothLanguages(received, testFn);
    
    if (result.de && result.en) {
      return {
        message: () => `Expected component to fail in at least one language`,
        pass: true,
      };
    } else {
      const failedLanguages: string[] = [];
      if (!result.de) failedLanguages.push('German');
      if (!result.en) failedLanguages.push('English');
      
      const failureDetails = result.details
        .filter(d => !d.success)
        .map(d => `${d.language} (${d.viewport}): ${d.error}`)
        .join('\n');
      
      return {
        message: () => 
          `Expected component to work in both languages. Failed in: ${failedLanguages.join(', ')}\n${failureDetails}`,
        pass: false,
      };
    }
  },
};

// Extend vitest matchers
declare module 'vitest' {
  interface AsymmetricMatchersContaining {
    toHandleGermanTextExpansion: (maxExpansionFactor?: number) => unknown;
    toHaveGoodGermanTypography: (minScore?: number) => unknown;
    toWorkInBothLanguages: (testFn: (language: 'de' | 'en') => Promise<void> | void) => unknown;
  }
}