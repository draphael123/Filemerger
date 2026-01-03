import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { parse, isValid, format } from 'date-fns';
import { getFieldCategory } from './fieldMapping';

/**
 * Basic normalization: trim and lowercase
 */
export function basicNormalize(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Normalize phone numbers to E.164 format
 */
export function normalizePhoneNumber(phone: string): string {
  try {
    // Remove common formatting characters for initial check
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Try to parse with country code
    if (isValidPhoneNumber(phone, 'US')) {
      const parsed = parsePhoneNumber(phone, 'US');
      return parsed.format('E.164');
    }
    
    // Try without country assumption
    if (isValidPhoneNumber(phone)) {
      const parsed = parsePhoneNumber(phone);
      return parsed.format('E.164');
    }
    
    // If parsing fails, return cleaned version
    return cleaned;
  } catch (error) {
    // Return cleaned version if parsing fails
    return phone.replace(/[\s\-\(\)\.]/g, '');
  }
}

/**
 * Normalize dates to ISO format (YYYY-MM-DD)
 */
export function normalizeDate(dateStr: string): string {
  const commonFormats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'MM-dd-yyyy',
    'dd-MM-yyyy',
    'yyyy/MM/dd',
    'MMM dd, yyyy',
    'MMMM dd, yyyy',
    'dd MMM yyyy',
    'dd MMMM yyyy',
  ];
  
  for (const formatStr of commonFormats) {
    try {
      const parsed = parse(dateStr, formatStr, new Date());
      if (isValid(parsed)) {
        return format(parsed, 'yyyy-MM-dd');
      }
    } catch (error) {
      continue;
    }
  }
  
  // Try native Date parsing as fallback
  try {
    const date = new Date(dateStr);
    if (isValid(date) && !isNaN(date.getTime())) {
      return format(date, 'yyyy-MM-dd');
    }
  } catch (error) {
    // Fall through to return original
  }
  
  return basicNormalize(dateStr);
}

/**
 * Normalize currency amounts
 */
export function normalizeCurrency(amount: string): string {
  // Remove currency symbols, commas, and whitespace
  const cleaned = amount.replace(/[$€£¥,\s]/g, '');
  
  // Parse as float and format to 2 decimal places
  const parsed = parseFloat(cleaned);
  if (!isNaN(parsed)) {
    return parsed.toFixed(2);
  }
  
  return cleaned;
}

/**
 * Basic address normalization
 */
export function normalizeAddress(address: string): string {
  let normalized = basicNormalize(address);
  
  // Expand common abbreviations
  const abbreviations: Record<string, string> = {
    'st': 'street',
    'ave': 'avenue',
    'blvd': 'boulevard',
    'dr': 'drive',
    'rd': 'road',
    'ln': 'lane',
    'ct': 'court',
    'cir': 'circle',
    'apt': 'apartment',
    'ste': 'suite',
    'fl': 'floor',
    'bldg': 'building',
  };
  
  // Replace abbreviations (word boundaries)
  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr}\\b`, 'g');
    normalized = normalized.replace(regex, full);
  }
  
  // Remove extra spaces
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Main normalization function that applies appropriate normalization based on field category
 */
export function normalizeValue(value: string, canonicalField: string): string {
  if (!value || value.trim() === '') {
    return '';
  }
  
  const category = getFieldCategory(canonicalField);
  
  switch (category) {
    case 'phone':
      return normalizePhoneNumber(value);
    
    case 'date':
      return normalizeDate(value);
    
    case 'currency':
      return normalizeCurrency(value);
    
    case 'address':
      return normalizeAddress(value);
    
    case 'email':
      return basicNormalize(value);
    
    case 'name':
      // For names, preserve more structure but normalize spacing
      return value.trim().toLowerCase().replace(/\s+/g, ' ');
    
    case 'id':
      // For IDs, remove spaces and dashes, keep case-insensitive
      return value.trim().toLowerCase().replace(/[\s\-]/g, '');
    
    default:
      return basicNormalize(value);
  }
}

