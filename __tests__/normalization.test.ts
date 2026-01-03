import {
  normalizePhoneNumber,
  normalizeDate,
  normalizeCurrency,
  normalizeAddress,
  normalizeValue,
  basicNormalize,
} from '../lib/normalization';

describe('Normalization Functions', () => {
  describe('basicNormalize', () => {
    it('should trim and lowercase strings', () => {
      expect(basicNormalize('  Hello World  ')).toBe('hello world');
      expect(basicNormalize('UPPERCASE')).toBe('uppercase');
      expect(basicNormalize('MiXeD CaSe')).toBe('mixed case');
    });
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize US phone numbers to E.164 format', () => {
      expect(normalizePhoneNumber('(555) 123-4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('555-123-4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('555.123.4567')).toBe('+15551234567');
      expect(normalizePhoneNumber('5551234567')).toBe('+15551234567');
    });

    it('should handle international phone numbers', () => {
      expect(normalizePhoneNumber('+1 555 123 4567')).toBe('+15551234567');
    });

    it('should clean invalid phone numbers', () => {
      const result = normalizePhoneNumber('not-a-phone');
      expect(result).toBe('notaphone');
    });
  });

  describe('normalizeDate', () => {
    it('should normalize various date formats to YYYY-MM-DD', () => {
      expect(normalizeDate('01/15/2024')).toBe('2024-01-15');
      expect(normalizeDate('2024-01-15')).toBe('2024-01-15');
      expect(normalizeDate('Jan 15, 2024')).toBe('2024-01-15');
      expect(normalizeDate('January 15, 2024')).toBe('2024-01-15');
      expect(normalizeDate('15/01/2024')).toBe('2024-01-15');
    });

    it('should return original string for invalid dates', () => {
      const result = normalizeDate('not-a-date');
      expect(result).toBe('not-a-date');
    });
  });

  describe('normalizeCurrency', () => {
    it('should normalize currency values', () => {
      expect(normalizeCurrency('$100.50')).toBe('100.50');
      expect(normalizeCurrency('€1,234.56')).toBe('1234.56');
      expect(normalizeCurrency('£99.99')).toBe('99.99');
      expect(normalizeCurrency('1234')).toBe('1234.00');
      expect(normalizeCurrency('$1,000,000.99')).toBe('1000000.99');
    });

    it('should handle values without decimal places', () => {
      expect(normalizeCurrency('100')).toBe('100.00');
      expect(normalizeCurrency('$50')).toBe('50.00');
    });
  });

  describe('normalizeAddress', () => {
    it('should normalize addresses with common abbreviations', () => {
      expect(normalizeAddress('123 Main St')).toBe('123 main street');
      expect(normalizeAddress('456 Oak Ave')).toBe('456 oak avenue');
      expect(normalizeAddress('789 Elm Blvd')).toBe('789 elm boulevard');
      expect(normalizeAddress('Apt 5B')).toBe('apartment 5b');
    });

    it('should remove extra spaces', () => {
      expect(normalizeAddress('123  Main   St')).toBe('123 main street');
    });

    it('should handle mixed case and trim', () => {
      expect(normalizeAddress('  123 MAIN ST  ')).toBe('123 main street');
    });
  });

  describe('normalizeValue', () => {
    it('should apply phone normalization for phone fields', () => {
      expect(normalizeValue('(555) 123-4567', 'phone_number')).toBe('+15551234567');
    });

    it('should apply date normalization for date fields', () => {
      expect(normalizeValue('01/15/2024', 'date_of_birth')).toBe('2024-01-15');
    });

    it('should apply currency normalization for amount fields', () => {
      expect(normalizeValue('$100.50', 'amount')).toBe('100.50');
    });

    it('should apply address normalization for address fields', () => {
      expect(normalizeValue('123 Main St', 'street_address')).toBe('123 main street');
    });

    it('should apply basic normalization for generic fields', () => {
      expect(normalizeValue('  Some Value  ', 'unknown_field')).toBe('some value');
    });

    it('should handle empty values', () => {
      expect(normalizeValue('', 'any_field')).toBe('');
      expect(normalizeValue('   ', 'any_field')).toBe('');
    });
  });
});

