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

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  isSubscribed: boolean;
  quickCloseTickets: number;
  agreedToTerms: boolean;
  agreedToMarketing: boolean;
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
  startPrice: number; // For auction: starting price. For shop: fixed price.
  currentPrice: number; // For auction: current bid. For shop: fixed price.
  
  // New Pricing Fields
  originalPrice?: number; // 원가 (정가)
  costPrice?: number;     // 매입가 (우리가 떼온 가격)
  appraisedValue?: number; // 감정가

  createdAt: number;
  endsAt: number; // 30 days from creation
  bids: Bid[];
  deliveryMethod: DeliveryMethod;
  winnerId?: string;
}

export const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Antiques', 'Books', 'Others'];