export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string | null;
  role: UserRole;
  isPhoneVerified: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  mobile: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  building: string;
  landmark: string;
  notes: string;
  isDefault: boolean;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  offers: boolean;
  academy: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export type InquiryType =
  | 'product'
  | 'order'
  | 'guidance'
  | 'complaint'
  | 'partnership';

export interface ContactMessage {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  type: InquiryType;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}
