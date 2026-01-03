import { FieldCategory } from '@/types/fact';

// Field synonym mapping
const FIELD_SYNONYMS: Record<string, string[]> = {
  'date_of_birth': ['dob', 'birth_date', 'birthdate', 'date of birth', 'birth date', 'birthday'],
  'phone_number': ['phone', 'tel', 'telephone', 'mobile', 'cell', 'contact_number', 'contact number'],
  'email_address': ['email', 'e-mail', 'mail', 'email address'],
  'first_name': ['fname', 'first name', 'firstname', 'given name', 'givenname'],
  'last_name': ['lname', 'last name', 'lastname', 'surname', 'family name', 'familyname'],
  'full_name': ['name', 'full name', 'fullname', 'customer name', 'client name'],
  'street_address': ['address', 'street', 'address line 1', 'address1', 'street address'],
  'city': ['town', 'locality', 'city name'],
  'state': ['province', 'region', 'state/province'],
  'zip_code': ['zip', 'postal_code', 'postal code', 'postcode', 'zipcode'],
  'country': ['country name', 'nation'],
  'invoice_number': ['invoice', 'invoice #', 'invoice no', 'invoice_id', 'inv_number'],
  'order_number': ['order', 'order #', 'order no', 'order_id'],
  'customer_id': ['customer id', 'client id', 'cust_id', 'customerid'],
  'amount': ['total', 'price', 'cost', 'sum', 'value'],
  'date': ['transaction_date', 'purchase_date', 'order_date', 'invoice_date'],
};

// Field categories for determining fuzzy match eligibility
const FIELD_CATEGORIES: Record<string, FieldCategory> = {
  'first_name': 'name',
  'last_name': 'name',
  'full_name': 'name',
  'street_address': 'address',
  'city': 'address',
  'invoice_number': 'id',
  'order_number': 'id',
  'customer_id': 'id',
  'email_address': 'email',
  'phone_number': 'phone',
  'date_of_birth': 'date',
  'date': 'date',
  'amount': 'currency',
  'zip_code': 'id',
};

/**
 * Maps a field name to its canonical form
 */
export function getCanonicalField(fieldName: string): string {
  const normalized = fieldName.toLowerCase().trim().replace(/[_\s]+/g, '_');
  
  // Check if it's already canonical
  if (FIELD_SYNONYMS[normalized]) {
    return normalized;
  }
  
  // Search through synonyms
  for (const [canonical, synonyms] of Object.entries(FIELD_SYNONYMS)) {
    if (synonyms.some(syn => syn === normalized || syn.replace(/[_\s]+/g, '_') === normalized)) {
      return canonical;
    }
  }
  
  // Return normalized version if no match found
  return normalized;
}

/**
 * Gets the field category for deduplication strategy
 */
export function getFieldCategory(canonicalField: string): FieldCategory {
  return FIELD_CATEGORIES[canonicalField] || 'generic';
}

/**
 * Determines if a field should use fuzzy matching
 */
export function shouldUseFuzzyMatch(canonicalField: string): boolean {
  const category = getFieldCategory(canonicalField);
  // Only names and addresses use fuzzy matching
  return category === 'name' || category === 'address';
}

