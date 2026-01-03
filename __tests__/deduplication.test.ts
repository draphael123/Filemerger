import { deduplicateFacts, sortFacts } from '../lib/deduplication';
import { Fact } from '../types/fact';

describe('Deduplication Functions', () => {
  const createFact = (
    field: string,
    canonicalField: string,
    value: string,
    normalizedValue: string,
    fileName: string = 'test.csv',
    location: string = 'row 1'
  ): Fact => ({
    field,
    canonicalField,
    value,
    normalizedValue,
    sources: [
      {
        fileName,
        fileType: 'csv',
        location,
        confidence: 1.0,
      },
    ],
  });

  describe('deduplicateFacts', () => {
    it('should merge exact duplicates', () => {
      const facts: Fact[] = [
        createFact('Name', 'full_name', 'John Doe', 'john doe', 'file1.csv', 'row 1'),
        createFact('Name', 'full_name', 'John Doe', 'john doe', 'file2.csv', 'row 2'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      expect(mergedFacts).toHaveLength(1);
      expect(mergedFacts[0].sources).toHaveLength(2);
      expect(conflicts).toHaveLength(0);
    });

    it('should merge fuzzy duplicates for names', () => {
      const facts: Fact[] = [
        createFact('Name', 'full_name', 'John Doe', 'john doe', 'file1.csv'),
        createFact('Name', 'full_name', 'John  Doe', 'john  doe', 'file2.csv'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      // Should merge due to high similarity
      expect(mergedFacts).toHaveLength(1);
      expect(mergedFacts[0].sources).toHaveLength(2);
      expect(conflicts).toHaveLength(0);
    });

    it('should NOT fuzzy match IDs', () => {
      const facts: Fact[] = [
        createFact('Invoice', 'invoice_number', 'INV-001', 'inv001', 'file1.csv'),
        createFact('Invoice', 'invoice_number', 'INV-002', 'inv002', 'file2.csv'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      // Should not merge, different IDs
      expect(mergedFacts).toHaveLength(2);
      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].canonicalField).toBe('invoice_number');
      expect(conflicts[0].values).toHaveLength(2);
    });

    it('should detect conflicts for same field with different values', () => {
      const facts: Fact[] = [
        createFact('Phone', 'phone_number', '555-1234', '+15551234', 'file1.csv'),
        createFact('Phone', 'phone_number', '555-5678', '+15555678', 'file2.csv'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].canonicalField).toBe('phone_number');
      expect(conflicts[0].values).toHaveLength(2);
    });

    it('should handle multiple different fields without conflicts', () => {
      const facts: Fact[] = [
        createFact('Name', 'full_name', 'John Doe', 'john doe', 'file1.csv'),
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com', 'file1.csv'),
        createFact('Phone', 'phone_number', '555-1234', '+15551234', 'file1.csv'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      expect(mergedFacts).toHaveLength(3);
      expect(conflicts).toHaveLength(0);
    });

    it('should handle empty facts array', () => {
      const { mergedFacts, conflicts } = deduplicateFacts([]);

      expect(mergedFacts).toHaveLength(0);
      expect(conflicts).toHaveLength(0);
    });

    it('should merge multiple sources for same fact', () => {
      const facts: Fact[] = [
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com', 'file1.csv', 'row 1'),
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com', 'file2.csv', 'row 5'),
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com', 'file3.csv', 'row 10'),
      ];

      const { mergedFacts, conflicts } = deduplicateFacts(facts);

      expect(mergedFacts).toHaveLength(1);
      expect(mergedFacts[0].sources).toHaveLength(3);
      expect(conflicts).toHaveLength(0);
    });
  });

  describe('sortFacts', () => {
    it('should sort facts by canonical field', () => {
      const facts: Fact[] = [
        createFact('Phone', 'phone_number', '555-1234', '+15551234'),
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com'),
        createFact('Name', 'full_name', 'John Doe', 'john doe'),
      ];

      const sorted = sortFacts(facts);

      expect(sorted[0].canonicalField).toBe('email_address');
      expect(sorted[1].canonicalField).toBe('full_name');
      expect(sorted[2].canonicalField).toBe('phone_number');
    });

    it('should sort by normalized value within same field', () => {
      const facts: Fact[] = [
        createFact('Name', 'full_name', 'Zoe Smith', 'zoe smith'),
        createFact('Name', 'full_name', 'Alice Johnson', 'alice johnson'),
        createFact('Name', 'full_name', 'Bob Brown', 'bob brown'),
      ];

      const sorted = sortFacts(facts);

      expect(sorted[0].normalizedValue).toBe('alice johnson');
      expect(sorted[1].normalizedValue).toBe('bob brown');
      expect(sorted[2].normalizedValue).toBe('zoe smith');
    });

    it('should not modify original array', () => {
      const facts: Fact[] = [
        createFact('Phone', 'phone_number', '555-1234', '+15551234'),
        createFact('Email', 'email_address', 'john@example.com', 'john@example.com'),
      ];

      const original = [...facts];
      sortFacts(facts);

      expect(facts).toEqual(original);
    });
  });
});

