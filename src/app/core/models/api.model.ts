export interface ApiResponse<T> {
  success: boolean;
  data: T;
  messageAr?: string;
  messageEn?: string;
}

export interface ApiError {
  code: string;
  messageAr: string;
  messageEn: string;
  fieldErrors?: Record<string, string>;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BreadcrumbItem {
  labelAr: string;
  labelEn: string;
  url?: string;
}
