import type { ParsedActionGuide } from '../types/test';

export const parseActionGuide = (text: string): ParsedActionGuide => {
  const regex = /<action_guide>([\s\S]*?)<\/action_guide>/;
  const match = text.match(regex);

  if (!match) {
    return {
      raw: '',
      parsed: null,
      isValid: false,
      errors: ['No <action_guide> tag found'],
    };
  }

  const raw = match[1].trim();

  try {
    const parsed = JSON.parse(raw);
    const errors: string[] = [];

    // 기본 검증
    if (!parsed.name) {
      errors.push('Missing required field: name');
    }
    if (!parsed.steps || !Array.isArray(parsed.steps)) {
      errors.push('Missing or invalid field: steps (must be an array)');
    }

    return {
      raw,
      parsed,
      isValid: errors.length === 0,
      errors,
    };
  } catch (error) {
    return {
      raw,
      parsed: null,
      isValid: false,
      errors: ['Invalid JSON format: ' + (error as Error).message],
    };
  }
};

export const formatJSON = (obj: any): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};
