export interface ActionGuide {
  id: string;
  name: string;
  version: string;
  description: string;
  data: any; // JSON 데이터
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'archived';
}

export interface ActionGuideFormData {
  name: string;
  version: string;
  description: string;
  data: string; // JSON string for editing
  status: 'draft' | 'active' | 'archived';
}
