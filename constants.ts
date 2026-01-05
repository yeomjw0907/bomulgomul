import { Product, ProductType, ProductStatus, DeliveryMethod, User, UserRole } from './types';

export const APP_NAME = "보물고물";
export const TAGLINE = "고물 안에서 보물을 찾아보세요";

// Mock Data
export const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: '김철수',
    phoneNumber: '010-1234-5678',
    address: '서울시 강남구 역삼동',
    role: UserRole.SELLER,
    isSubscribed: true,
    quickCloseTickets: 1,
    ticketsPurchasedMonth: 2, 
    agreedToTerms: true,
    agreedToMarketing: true,
    xp: 450 // Lv.3
  },
  {
    id: 'user2',
    name: '이영희',
    phoneNumber: '010-9876-5432',
    address: '경기도 성남시 분당구',
    role: UserRole.BUYER,
    isSubscribed: false,
    quickCloseTickets: 0,
    ticketsPurchasedMonth: 0,
    agreedToTerms: true,
    agreedToMarketing: false,
    xp: 60 // Lv.1
  },
  {
    id: 'admin',
    name: '관리자',
    phoneNumber: '000-0000-0000',
    address: '본사',
    role: UserRole.ADMIN,
    isSubscribed: false,
    quickCloseTickets: 999,
    ticketsPurchasedMonth: 0,
    agreedToTerms: true,
    agreedToMarketing: true,
    xp: 9999
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    sellerId: 'user1',
    sellerName: '김철수',
    title: '빈티지 필름 카메라 (Leica M3)',
    description: '1980년대 빈티지 카메라입니다. 렌즈 상태 아주 좋습니다. 수집가들에게 추천합니다.',
    category: 'Antiques',
    image: 'https://picsum.photos/400/300?random=1',
    type: ProductType.AUCTION,
    status: ProductStatus.ACTIVE,
    startPrice: 50000,
    currentPrice: 120000,
    originalPrice: 2500000, // 원가
    costPrice: 80000,       // 매입가
    appraisedValue: 1500000, // 감정가
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    endsAt: Date.now() + 86400000 * 28,
    bids: [
        { id: 'b1', bidderId: 'user2', bidderName: '이영희', amount: 80000, timestamp: Date.now() - 80000000 },
        { id: 'b2', bidderId: 'admin', bidderName: '박수집', amount: 100000, timestamp: Date.now() - 40000000 },
        { id: 'b3', bidderId: 'user2', bidderName: '이영희', amount: 120000, timestamp: Date.now() - 10000 }
    ],
    deliveryMethod: DeliveryMethod.PARCEL
  },
  {
    id: 'p2',
    sellerId: 'user1',
    sellerName: '김철수',
    title: '이탈리아산 가죽 소파',
    description: '3년 사용한 가죽 소파입니다. 가죽 에이징이 멋스럽게 되었습니다.',
    category: 'Furniture',
    image: 'https://picsum.photos/400/300?random=2',
    type: ProductType.AUCTION,
    status: ProductStatus.ACTIVE,
    startPrice: 100000,
    currentPrice: 150000,
    originalPrice: 3000000,
    costPrice: 50000,
    appraisedValue: 400000,
    createdAt: Date.now() - 86400000 * 5,
    endsAt: Date.now() + 86400000 * 25,
    bids: [
      { id: 'b1', bidderId: 'user2', bidderName: '이영희', amount: 150000, timestamp: Date.now() - 10000 }
    ],
    deliveryMethod: DeliveryMethod.PICKUP
  },
  {
    id: 'p3',
    sellerId: 'admin', // Official store item
    sellerName: '보물고물 공식',
    title: '안전 인증 중고 맥북 프로',
    description: '전문가가 검수한 리퍼비시 노트북입니다. 6개월 보증 포함.',
    category: 'Electronics',
    image: 'https://picsum.photos/400/300?random=3',
    type: ProductType.SHOP,
    status: ProductStatus.ACTIVE,
    startPrice: 850000,
    currentPrice: 850000,
    originalPrice: 2900000,
    costPrice: 600000,
    appraisedValue: 950000,
    createdAt: Date.now(),
    endsAt: Date.now() + 86400000 * 30,
    bids: [],
    deliveryMethod: DeliveryMethod.PARCEL
  }
];