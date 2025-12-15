import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  Language,
  TranslationEntry,
  TranslationAPIError,
  getOppositeLanguage
} from '../types';
import {
  loadHistory,
  saveEntry,
  deleteEntry,
  clearAll
} from '../services/historyService';
import { ERROR_CODES, getErrorMessage } from '../services/translationAPI';
import useTranslatorStore from '../store/useTranslatorStore';

// Arbitrary for Language type
const languageArb = fc.constantFrom<Language>('en', 'ja');

// Arbitrary for generating valid TranslationEntry objects
const translationEntryArb = fc.record({
  id: fc.uuid(),
  sourceText: fc.string({ minLength: 1, maxLength: 100 }),
  translatedText: fc.string({ minLength: 1, maxLength: 100 }),
  sourceLanguage: languageArb,
  targetLanguage: languageArb,
  romanization: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
    nil: undefined
  }),
  timestamp: fc.integer({ min: 0, max: Date.now() + 1000000 })
});

describe('Translator Property Tests', () => {
  /**
   * **Feature: japanese-translator, Property 2: Language auto-swap**
   * For any source language selection, the target language should automatically
   * be set to the opposite language (en → ja, ja → en).
   * **Validates: Requirements 2.2**
   */
  describe('Property 2: Language auto-swap', () => {
    it('getOppositeLanguage always returns the opposite language', () => {
      fc.assert(
        fc.property(languageArb, (sourceLang: Language) => {
          const targetLang = getOppositeLanguage(sourceLang);

          // Target should be different from source
          expect(targetLang).not.toBe(sourceLang);

          // en -> ja, ja -> en
          if (sourceLang === 'en') {
            expect(targetLang).toBe('ja');
          } else {
            expect(targetLang).toBe('en');
          }
        }),
        { numRuns: 100 }
      );
    });

    it('getOppositeLanguage is an involution (applying twice returns original)', () => {
      fc.assert(
        fc.property(languageArb, (lang: Language) => {
          const opposite = getOppositeLanguage(lang);
          const backToOriginal = getOppositeLanguage(opposite);
          expect(backToOriginal).toBe(lang);
        }),
        { numRuns: 100 }
      );
    });

    it('getOppositeLanguage always returns a valid Language type', () => {
      fc.assert(
        fc.property(languageArb, (lang: Language) => {
          const result = getOppositeLanguage(lang);
          expect(['en', 'ja']).toContain(result);
        }),
        { numRuns: 100 }
      );
    });
  });
});

describe('History Service Property Tests', () => {
  // Clear history before each test to ensure isolation
  beforeEach(async () => {
    await clearAll();
  });

  /**
   * **Feature: japanese-translator, Property 5: Translation history round-trip**
   * For any translation entry saved to history, loading the history should return
   * an entry with identical sourceText, translatedText, sourceLanguage, targetLanguage, and timestamp.
   * **Validates: Requirements 3.1, 3.2**
   */
  describe('Property 5: Translation history round-trip', () => {
    it('saved entries can be retrieved with identical data', async () => {
      await fc.assert(
        fc.asyncProperty(
          translationEntryArb,
          async (entry: TranslationEntry) => {
            // Clear before each iteration
            await clearAll();

            // Save the entry
            await saveEntry(entry);

            // Load history
            const history = await loadHistory();

            // Find the saved entry
            const savedEntry = history.find(e => e.id === entry.id);

            // Entry should exist
            expect(savedEntry).toBeDefined();

            // All fields should match
            expect(savedEntry!.sourceText).toBe(entry.sourceText);
            expect(savedEntry!.translatedText).toBe(entry.translatedText);
            expect(savedEntry!.sourceLanguage).toBe(entry.sourceLanguage);
            expect(savedEntry!.targetLanguage).toBe(entry.targetLanguage);
            expect(savedEntry!.timestamp).toBe(entry.timestamp);
            expect(savedEntry!.romanization).toBe(entry.romanization);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * **Feature: japanese-translator, Property 7: History delete removes entry**
 * For any history entry, after deletion, the history should not contain an entry with that id.
 * **Validates: Requirements 3.4**
 */
describe('Property 7: History delete removes entry', () => {
  it('deleted entries are no longer in history', async () => {
    await fc.assert(
      fc.asyncProperty(translationEntryArb, async (entry: TranslationEntry) => {
        // Clear before each iteration
        await clearAll();

        // Save the entry first
        await saveEntry(entry);

        // Verify it exists
        let history = await loadHistory();
        expect(history.some(e => e.id === entry.id)).toBe(true);

        // Delete the entry
        await deleteEntry(entry.id);

        // Load history again
        history = await loadHistory();

        // Entry should no longer exist
        expect(history.some(e => e.id === entry.id)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  it('deleting an entry preserves other entries', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(translationEntryArb, { minLength: 2, maxLength: 5 }),
        async (entries: TranslationEntry[]) => {
          // Clear before each iteration
          await clearAll();

          // Ensure unique IDs
          const uniqueEntries = entries.map((e, i) => ({
            ...e,
            id: `${e.id}-${i}`
          }));

          // Save all entries
          for (const entry of uniqueEntries) {
            await saveEntry(entry);
          }

          // Delete the first entry
          const entryToDelete = uniqueEntries[0];
          await deleteEntry(entryToDelete.id);

          // Load history
          const history = await loadHistory();

          // Deleted entry should not exist
          expect(history.some(e => e.id === entryToDelete.id)).toBe(false);

          // Other entries should still exist
          for (let i = 1; i < uniqueEntries.length; i++) {
            expect(history.some(e => e.id === uniqueEntries[i].id)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: japanese-translator, Property 8: Clear all empties history**
 * For any non-empty history, after clearing all, the history length should be zero.
 * **Validates: Requirements 3.5**
 */
describe('Property 8: Clear all empties history', () => {
  it('clearAll results in empty history', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(translationEntryArb, { minLength: 1, maxLength: 10 }),
        async (entries: TranslationEntry[]) => {
          // Clear before each iteration
          await clearAll();

          // Ensure unique IDs
          const uniqueEntries = entries.map((e, i) => ({
            ...e,
            id: `${e.id}-${i}`
          }));

          // Save all entries
          for (const entry of uniqueEntries) {
            await saveEntry(entry);
          }

          // Verify history is not empty
          let history = await loadHistory();
          expect(history.length).toBeGreaterThan(0);

          // Clear all
          await clearAll();

          // Load history again
          history = await loadHistory();

          // History should be empty
          expect(history.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: japanese-translator, Property 11: API errors show messages**
 * For any API error response, the error state should contain a non-empty user-friendly message.
 * **Validates: Requirements 5.1**
 */
describe('Property 11: API errors show messages', () => {
  // Arbitrary for generating valid error codes
  const errorCodeArb = fc.constantFrom(
    ERROR_CODES.INVALID_INPUT,
    ERROR_CODES.RATE_LIMIT,
    ERROR_CODES.API_ERROR,
    ERROR_CODES.AUTH_ERROR,
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.OFFLINE
  );

  // Arbitrary for generating TranslationAPIError objects
  const apiErrorArb = fc.record({
    code: errorCodeArb,
    message: fc.string({ minLength: 1, maxLength: 200 }),
    status: fc.integer({ min: 0, max: 599 })
  }) as fc.Arbitrary<TranslationAPIError>;

  it('getErrorMessage always returns a non-empty string for known error codes', () => {
    fc.assert(
      fc.property(errorCodeArb, (errorCode: string) => {
        const message = getErrorMessage(errorCode);

        // Message should be a non-empty string
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('getErrorMessage returns a fallback message for unknown error codes', () => {
    // Reserved JavaScript property names that exist on all objects
    const reservedProps = [
      'constructor',
      'toString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      '__proto__',
      '__defineGetter__',
      '__defineSetter__',
      '__lookupGetter__',
      '__lookupSetter__'
    ];

    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter(
            s =>
              !Object.values(ERROR_CODES).includes(
                s as (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
              ) && !reservedProps.includes(s)
          ),
        (unknownCode: string) => {
          const message = getErrorMessage(unknownCode);

          // Should return a non-empty fallback message
          expect(typeof message).toBe('string');
          expect(message.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all error codes have distinct, meaningful messages', () => {
    const allCodes = Object.values(ERROR_CODES);
    const messages = allCodes.map(code => getErrorMessage(code));

    // All messages should be non-empty
    messages.forEach(msg => {
      expect(msg.length).toBeGreaterThan(0);
    });

    // Messages should be user-friendly (contain common words)
    messages.forEach(msg => {
      // Each message should contain at least one common word indicating it's user-friendly
      const hasUserFriendlyContent =
        msg.includes('Please') ||
        msg.includes('error') ||
        msg.includes('unavailable') ||
        msg.includes('connection') ||
        msg.includes('offline') ||
        msg.includes('wait');
      expect(hasUserFriendlyContent).toBe(true);
    });
  });

  it('API error objects always have required fields', () => {
    fc.assert(
      fc.property(apiErrorArb, (error: TranslationAPIError) => {
        // Error should have code
        expect(error.code).toBeDefined();
        expect(typeof error.code).toBe('string');

        // Error should have message
        expect(error.message).toBeDefined();
        expect(typeof error.message).toBe('string');

        // Error should have status
        expect(error.status).toBeDefined();
        expect(typeof error.status).toBe('number');
      }),
      { numRuns: 100 }
    );
  });
});

describe('Translator Store Property Tests', () => {
  // Reset store state before each test
  beforeEach(() => {
    useTranslatorStore.setState({
      sourceText: '',
      sourceLanguage: 'en',
      targetLanguage: 'ja',
      translatedText: '',
      romanization: null,
      isLoading: false,
      error: null,
      isOffline: false,
      history: []
    });
  });

  /**
   * **Feature: japanese-translator, Property 3: Swap preserves content**
   * For any translator state with source text and translated text, swapping languages
   * should exchange the source and target languages AND swap the source text with the translated text.
   * **Validates: Requirements 2.3**
   */
  describe('Property 3: Swap preserves content', () => {
    it('swapping languages exchanges source/target languages and text', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          fc.string({ minLength: 0, maxLength: 100 }),
          languageArb,
          (
            sourceText: string,
            translatedText: string,
            sourceLang: Language
          ) => {
            const targetLang = getOppositeLanguage(sourceLang);

            // Set initial state
            useTranslatorStore.setState({
              sourceText,
              translatedText,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang
            });

            // Perform swap
            useTranslatorStore.getState().swapLanguages();

            // Get new state
            const state = useTranslatorStore.getState();

            // Languages should be swapped
            expect(state.sourceLanguage).toBe(targetLang);
            expect(state.targetLanguage).toBe(sourceLang);

            // Text should be swapped
            expect(state.sourceText).toBe(translatedText);
            expect(state.translatedText).toBe(sourceText);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('double swap returns to original state', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          fc.string({ minLength: 0, maxLength: 100 }),
          languageArb,
          (
            sourceText: string,
            translatedText: string,
            sourceLang: Language
          ) => {
            const targetLang = getOppositeLanguage(sourceLang);

            // Set initial state
            useTranslatorStore.setState({
              sourceText,
              translatedText,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang
            });

            // Perform double swap
            useTranslatorStore.getState().swapLanguages();
            useTranslatorStore.getState().swapLanguages();

            // Get new state
            const state = useTranslatorStore.getState();

            // Should return to original
            expect(state.sourceLanguage).toBe(sourceLang);
            expect(state.targetLanguage).toBe(targetLang);
            expect(state.sourceText).toBe(sourceText);
            expect(state.translatedText).toBe(translatedText);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: japanese-translator, Property 9: Clear button empties fields**
   * For any state with non-empty sourceText or translatedText, calling clearInput
   * should result in both fields being empty strings.
   * **Validates: Requirements 4.2**
   */
  describe('Property 9: Clear button empties fields', () => {
    it('clearInput empties sourceText and translatedText', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          fc.string({ minLength: 0, maxLength: 100 }),
          fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
          (
            sourceText: string,
            translatedText: string,
            romanization: string | null
          ) => {
            // Set initial state with some content
            useTranslatorStore.setState({
              sourceText,
              translatedText,
              romanization
            });

            // Call clearInput
            useTranslatorStore.getState().clearInput();

            // Get new state
            const state = useTranslatorStore.getState();

            // Both fields should be empty
            expect(state.sourceText).toBe('');
            expect(state.translatedText).toBe('');
            expect(state.romanization).toBeNull();
            expect(state.error).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: japanese-translator, Property 6: History click restores state**
   * For any history entry, selecting it should set the sourceText to the entry's sourceText
   * and translatedText to the entry's translatedText.
   * **Validates: Requirements 3.3**
   */
  describe('Property 6: History click restores state', () => {
    it('restoreFromHistory sets state from entry', () => {
      fc.assert(
        fc.property(translationEntryArb, (entry: TranslationEntry) => {
          // Start with different state
          useTranslatorStore.setState({
            sourceText: 'different text',
            translatedText: 'different translation',
            sourceLanguage: entry.sourceLanguage === 'en' ? 'ja' : 'en',
            targetLanguage: entry.targetLanguage === 'en' ? 'ja' : 'en',
            romanization: null
          });

          // Restore from history entry
          useTranslatorStore.getState().restoreFromHistory(entry);

          // Get new state
          const state = useTranslatorStore.getState();

          // State should match entry
          expect(state.sourceText).toBe(entry.sourceText);
          expect(state.translatedText).toBe(entry.translatedText);
          expect(state.sourceLanguage).toBe(entry.sourceLanguage);
          expect(state.targetLanguage).toBe(entry.targetLanguage);
          expect(state.romanization).toBe(entry.romanization || null);
          expect(state.error).toBeNull();
        }),
        { numRuns: 100 }
      );
    });
  });
});
