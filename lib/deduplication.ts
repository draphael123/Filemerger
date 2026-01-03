import { compareTwoStrings } from 'string-similarity';
import { Fact, Conflict } from '@/types/fact';
import { shouldUseFuzzyMatch } from './fieldMapping';

const FUZZY_MATCH_THRESHOLD = 0.85; // 85% similarity for fuzzy matches

/**
 * Checks if two normalized values are an exact match
 */
function isExactMatch(value1: string, value2: string): boolean {
  return value1 === value2;
}

/**
 * Checks if two values are a fuzzy match (only for names and addresses)
 */
function isFuzzyMatch(value1: string, value2: string, canonicalField: string): boolean {
  if (!shouldUseFuzzyMatch(canonicalField)) {
    return false;
  }
  
  const similarity = compareTwoStrings(value1, value2);
  return similarity >= FUZZY_MATCH_THRESHOLD;
}

/**
 * Merges sources from two facts
 */
function mergeSources(fact1: Fact, fact2: Fact): Fact {
  return {
    ...fact1,
    sources: [...fact1.sources, ...fact2.sources],
  };
}

/**
 * Deduplicates an array of facts and detects conflicts
 */
export function deduplicateFacts(facts: Fact[]): { mergedFacts: Fact[]; conflicts: Conflict[] } {
  const mergedFacts: Fact[] = [];
  const conflicts: Conflict[] = [];
  const conflictMap = new Map<string, Map<string, Fact>>();
  
  for (const fact of facts) {
    let merged = false;
    
    // Try to find exact match in existing merged facts
    for (let i = 0; i < mergedFacts.length; i++) {
      const existingFact = mergedFacts[i];
      
      // Must have same canonical field
      if (existingFact.canonicalField !== fact.canonicalField) {
        continue;
      }
      
      // Check for exact match
      if (isExactMatch(existingFact.normalizedValue, fact.normalizedValue)) {
        mergedFacts[i] = mergeSources(existingFact, fact);
        merged = true;
        break;
      }
      
      // Check for fuzzy match (only for names and addresses)
      if (isFuzzyMatch(existingFact.normalizedValue, fact.normalizedValue, fact.canonicalField)) {
        mergedFacts[i] = mergeSources(existingFact, fact);
        merged = true;
        break;
      }
    }
    
    // If not merged, check for conflicts or add as new fact
    if (!merged) {
      // Check if there's already a different value for this field
      const existingWithSameField = mergedFacts.find(
        f => f.canonicalField === fact.canonicalField
      );
      
      if (existingWithSameField) {
        // We have a conflict: same field, different value
        if (!conflictMap.has(fact.canonicalField)) {
          conflictMap.set(fact.canonicalField, new Map());
        }
        
        const fieldConflicts = conflictMap.get(fact.canonicalField)!;
        
        // Add existing fact to conflicts if not already there
        if (!fieldConflicts.has(existingWithSameField.normalizedValue)) {
          fieldConflicts.set(existingWithSameField.normalizedValue, existingWithSameField);
        }
        
        // Add new fact to conflicts
        if (!fieldConflicts.has(fact.normalizedValue)) {
          fieldConflicts.set(fact.normalizedValue, fact);
        } else {
          // Merge sources if this normalized value already exists in conflicts
          const existing = fieldConflicts.get(fact.normalizedValue)!;
          fieldConflicts.set(fact.normalizedValue, mergeSources(existing, fact));
        }
      }
      
      mergedFacts.push(fact);
    }
  }
  
  // Convert conflict map to conflict array
  for (const [canonicalField, valueMap] of conflictMap.entries()) {
    if (valueMap.size > 1) {
      conflicts.push({
        canonicalField,
        values: Array.from(valueMap.values()).map(fact => ({
          value: fact.value,
          normalizedValue: fact.normalizedValue,
          sources: fact.sources,
        })),
      });
    }
  }
  
  return { mergedFacts, conflicts };
}

/**
 * Sorts facts for consistent output
 */
export function sortFacts(facts: Fact[]): Fact[] {
  return [...facts].sort((a, b) => {
    // Sort by canonical field first
    const fieldCompare = a.canonicalField.localeCompare(b.canonicalField);
    if (fieldCompare !== 0) return fieldCompare;
    
    // Then by normalized value
    return a.normalizedValue.localeCompare(b.normalizedValue);
  });
}

