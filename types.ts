export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  BUYER = 'BUYER'
}

export enum ProductType {
  AUCTION = 'AUCTION',
  SHOP = 'SHOP'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  EXPIRED = 'EXPIRED'
}

export enum DeliveryMethod {
  PARCEL = 'PARCEL', // 택배
  PICKUP = 'PICKUP'  // 직접 수령
}

export enum PaymentMethod {
  SIMPLE_PAY = 'SIMPLE_PAY', // 간편결제
  BANK_TRANSFER = 'BANK_TRANSFER' // 무통장입금
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export interface Report {
  id: string;
  targetId: string;
  targetType: 'PRODUCT' | 'USER';
  reporterId: string;
  reason: string;
  status: ReportStatus;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  isSubscribed: boolean;
  quickCloseTickets: number;
  ticketsPurchasedMonth: number;
  agreedToTerms: boolean;
  agreedToMarketing: boolean;
  xp: number; // Added Experience Points
}

export interface Bid {
  id: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  image: string;
  type: ProductType;
  status: ProductStatus;
  startPrice: number;
  currentPrice: number;
  originalPrice?: number;
  costPrice?: number;
  appraisedValue?: number;
  createdAt: number;
  endsAt: number;
  bids: Bid[];
  winnerId?: string;
  deliveryMethod: DeliveryMethod;
}

export const CATEGORIES = ['Antiques', 'Furniture', 'Electronics', 'Art', 'Fashion', 'Others'];