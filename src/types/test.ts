export interface LangfuseObservation {
  id: string;
  prompt: string;
  response: string;
  model: string;
  tokens: number;
  latency: number;
  metadata?: Record<string, any>;
}

export interface ParsedActionGuide {
  raw: string;
  parsed: any;
  isValid: boolean;
  errors: string[];
}

export interface TestComparison {
  original: {
    prompt: string;
    actionGuide: ParsedActionGuide;
    response: string;
    metadata: {
      model: string;
      tokens: number;
      latency: number;
    };
  };
  modified: {
    prompt: string;
    actionGuide: ParsedActionGuide;
    response: string | null;
    metadata: {
      model: string;
      tokens: number;
      latency: number;
    } | null;
  };
}
