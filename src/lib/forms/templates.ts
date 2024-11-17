export interface FormTemplate {
  formNumber: string;
  title: string;
  description: string;
  keyFields: string[];
  identifyingPatterns: string[];
}

export const WOTC_FORMS: FormTemplate[] = [
  {
    formNumber: '8850',
    title: 'Pre-Screening Notice and Certification Request',
    description: 'Initial screening form for WOTC eligibility',
    keyFields: [
      'name',
      'social_security_number',
      'address',
      'date_of_birth',
      'conditional_certification',
      'tanf_assistance',
      'snap_benefits',
    ],
    identifyingPatterns: [
      'Pre-Screening Notice and Certification Request',
      'Work Opportunity Credit',
      'Control No. 1545-1500',
    ],
  },
  {
    formNumber: '9061',
    title: 'Individual Characteristics Form',
    description: 'Detailed applicant information for WOTC',
    keyFields: [
      'applicant_name',
      'ssn',
      'hiring_date',
      'start_date',
      'starting_wage',
      'position',
      'target_group',
    ],
    identifyingPatterns: [
      'Individual Characteristics Form',
      'Work Opportunity Tax Credit',
      'ETA Form 9061',
    ],
  },
  {
    formNumber: '9062',
    title: 'Conditional Certification',
    description: 'SWA certification for WOTC eligibility',
    keyFields: [
      'participant_name',
      'ssn',
      'certification_date',
      'state_workforce_agency',
      'target_group_certification',
      'eligibility_period',
    ],
    identifyingPatterns: [
      'Conditional Certification',
      'ETA Form 9062',
      'State Workforce Agency',
    ],
  },
];

export function findMatchingPatterns(text: string, patterns: string[]): number {
  let matches = 0;
  patterns.forEach(pattern => {
    if (text.toLowerCase().includes(pattern.toLowerCase())) {
      matches++;
    }
  });
  return matches;
}

export function calculateConfidence(matches: number, totalPatterns: number): number {
  return Math.min(matches / totalPatterns, 0.95); // Cap at 95% confidence
}

export function extractFormFields(text: string, fields: string[]): Record<string, string> {
  const extractedFields: Record<string, string> = {};
  
  // Common patterns for field extraction
  const patterns = {
    name: /name:?\s*([^\n]+)/i,
    social_security_number: /social security:?\s*(\d{3}[-\s]?\d{2}[-\s]?\d{4})/i,
    address: /address:?\s*([^\n]+)/i,
    date_of_birth: /birth:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
    hiring_date: /hire\s*date:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i,
    starting_wage: /wage:?\s*\$?(\d+\.?\d*)/i,
    position: /position:?\s*([^\n]+)/i,
  };

  fields.forEach(field => {
    if (patterns[field as keyof typeof patterns]) {
      const match = text.match(patterns[field as keyof typeof patterns]);
      if (match && match[1]) {
        extractedFields[field] = match[1].trim();
      }
    }
  });

  return extractedFields;
}

export function identifyForm(text: string): {
  formType: string;
  confidence: number;
  template: FormTemplate;
} {
  let bestMatch = {
    formType: '',
    confidence: 0,
    template: WOTC_FORMS[0],
  };

  WOTC_FORMS.forEach(form => {
    const matches = findMatchingPatterns(text, form.identifyingPatterns);
    const confidence = calculateConfidence(matches, form.identifyingPatterns.length);

    if (confidence > bestMatch.confidence) {
      bestMatch = {
        formType: form.formNumber,
        confidence,
        template: form,
      };
    }
  });

  return bestMatch;
}
