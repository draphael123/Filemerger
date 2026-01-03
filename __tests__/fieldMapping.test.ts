import {
  getCanonicalField,
  getFieldCategory,
  shouldUseFuzzyMatch,
} from '../lib/fieldMapping';

describe('Field Mapping Functions', () => {
  describe('getCanonicalField', () => {
    it('should map common synonyms to canonical fields', () => {
      expect(getCanonicalField('DOB')).toBe('date_of_birth');
      expect(getCanonicalField('Birth Date')).toBe('date_of_birth');
      expect(getCanonicalField('phone')).toBe('phone_number');
      expect(getCanonicalField('tel')).toBe('phone_number');
      expect(getCanonicalField('email')).toBe('email_address');
      expect(getCanonicalField('First Name')).toBe('first_name');
      expect(getCanonicalField('LastName')).toBe('last_name');
    });

    it('should handle various formatting of field names', () => {
      expect(getCanonicalField('Phone Number')).toBe('phone_number');
      expect(getCanonicalField('phone_number')).toBe('phone_number');
      expect(getCanonicalField('PHONE NUMBER')).toBe('phone_number');
    });

    it('should return normalized version for unknown fields', () => {
      expect(getCanonicalField('Custom Field')).toBe('custom_field');
      expect(getCanonicalField('Random Name')).toBe('random_name');
    });

    it('should handle special characters and multiple spaces', () => {
      expect(getCanonicalField('Field   With   Spaces')).toBe('field_with_spaces');
    });
  });

  describe('getFieldCategory', () => {
    it('should return correct category for known fields', () => {
      expect(getFieldCategory('first_name')).toBe('name');
      expect(getFieldCategory('last_name')).toBe('name');
      expect(getFieldCategory('street_address')).toBe('address');
      expect(getFieldCategory('phone_number')).toBe('phone');
      expect(getFieldCategory('email_address')).toBe('email');
      expect(getFieldCategory('invoice_number')).toBe('id');
      expect(getFieldCategory('amount')).toBe('currency');
      expect(getFieldCategory('date_of_birth')).toBe('date');
    });

    it('should return generic for unknown fields', () => {
      expect(getFieldCategory('unknown_field')).toBe('generic');
      expect(getFieldCategory('custom_data')).toBe('generic');
    });
  });

  describe('shouldUseFuzzyMatch', () => {
    it('should return true for name fields', () => {
      expect(shouldUseFuzzyMatch('first_name')).toBe(true);
      expect(shouldUseFuzzyMatch('last_name')).toBe(true);
      expect(shouldUseFuzzyMatch('full_name')).toBe(true);
    });

    it('should return true for address fields', () => {
      expect(shouldUseFuzzyMatch('street_address')).toBe(true);
      expect(shouldUseFuzzyMatch('city')).toBe(true);
    });

    it('should return false for ID fields', () => {
      expect(shouldUseFuzzyMatch('invoice_number')).toBe(false);
      expect(shouldUseFuzzyMatch('customer_id')).toBe(false);
      expect(shouldUseFuzzyMatch('zip_code')).toBe(false);
    });

    it('should return false for email and phone fields', () => {
      expect(shouldUseFuzzyMatch('email_address')).toBe(false);
      expect(shouldUseFuzzyMatch('phone_number')).toBe(false);
    });

    it('should return false for generic fields', () => {
      expect(shouldUseFuzzyMatch('unknown_field')).toBe(false);
    });
  });
});

