import {describe, test, expect } from 'vitest';
import { WaitTimeCalculator } from './calculator';

describe('WaitTimeCalculator', () => { // Describe is a test suite, works like a header for my tests, first arg is a title, second is a callback func for all individual unit tests
    test('returns default wait time when there are zero reports', () => { // Each test function is one test case, first arg is desciption, second is test code
        const calc = new WaitTimeCalculator();
        const result = calc.calculateWait([], 15);
        expect(result).toBe(15); // JS/TS assertion is called expect... interesting  | Js using behavior driven development which focusses on human behavioryup
    });

    // TODO: Add unit tests for:
    // 1. outlier data filtering, 
    // 2. Time decay weighting
    // 3. Even vs odd median calculation 
});
