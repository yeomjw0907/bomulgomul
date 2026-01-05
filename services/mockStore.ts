import { INITIAL_PRODUCTS, MOCK_USERS } from '../constants';
import { Product, User, Bid, ProductType, ProductStatus, UserRole } from '../types';

type StoreEvent = {
  type: 'BID_UPDATE' | 'AUCTION_CLOSED';
  productId: string;
  product: Product;
};

type StoreListener = (event: StoreEvent) => void;

class MockStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private users: User[] = [...MOCK_USERS];
  private currentUser: User | null = null;
  private listeners: Set<StoreListener> = new Set();
  private channel: BroadcastChannel;

  constructor() {
    // Initialize user from LocalStorage to persist sessions across reloads
    const savedUserId = localStorage.getItem('bomul_current_user_id');
    if (savedUserId) {
      this.currentUser = this.users.find(u => u.id === savedUserId) || null; 
    } else {
      this.currentUser = null; 
    }

    // Initialize BroadcastChannel to simulate WebSocket behavior for real-time updates across tabs/windows
    this.channel = new BroadcastChannel('bomul_auction_updates');
    this.channel.onmessage = (event) => {
      const { type, productId, product } = event.data;
      this.handleRemoteUpdate(type, productId, product);
    };
  }

  // Real-time Subscription
  subscribe(listener: StoreListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Handle updates received from other tabs (simulating WebSocket message received)
  private handleRemoteUpdate(type: 'BID_UPDATE' | 'AUCTION_CLOSED', productId: string, updatedProduct: Product) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      // Notify local listeners (UI) about the update. 
      // Pass true for 'fromRemote' to prevent re-broadcasting.
      this.notify(type, productId, true); 
    }
  }

  private notify(type: 'BID_UPDATE' | 'AUCTION_CLOSED', productId: string, fromRemote: boolean = false) {
    const product = this.getProductById(productId);
    if (product) {
      // Broadcast to local listeners (React components)
      this.listeners.forEach(listener => listener({ type, productId, product: { ...product } }));
      
      // If this change originated locally, broadcast it to other tabs via Channel
      if (!fromRemote) {
        this.channel.postMessage({ type, productId, product });
      }
    }
  }

  // User Methods
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('bomul_current_user_id', userId);
    } else {
      // If passing empty or invalid, treat as logout
      this.currentUser = null;
      localStorage.removeItem('bomul_current_user_id');
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('bomul_current_user_id');
  }

  registerUser(user: User) {
    this.users.push(user);
    this.currentUser = user;
    localStorage.setItem('bomul_current_user_id', user.id);
  }

  subscribeUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isSubscribed = true;
      user.quickCloseTickets += 3;
    }
  }

  // Product Methods
  getProducts() {
    return this.products;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Product) {
    this.products.push(product);
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }

  // Auction Logic
  placeBid(productId: string, amount: number, bidder: User): { success: boolean; message: string } {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.type !== ProductType.AUCTION || product.status !== ProductStatus.ACTIVE) {
      return { success: false, message: '유효하지 않은 경매입니다.' };
    }

    if (amount <= product.currentPrice) {
      return { success: false, message: '현재 입찰가보다 높아야 합니다.' };
    }

    const maxPrice = product.startPrice * 10;
    
    // Add Bid
    const newBid: Bid = {
      id: Math.random().toString(36).substr(2, 9),
      bidderId: bidder.id,
      bidderName: bidder.name,
      amount: amount,
      timestamp: Date.now()
    };
    
    product.bids.push(newBid);
    product.currentPrice = amount;

    // Check Max Cap
    let eventType: 'BID_UPDATE' | 'AUCTION_CLOSED' = 'BID_UPDATE';
    if (amount >= maxPrice) {
      product.status = ProductStatus.SOLD;
      product.winnerId = bidder.id;
      eventType = 'AUCTION_CLOSED';
      this.notify(eventType, productId);
      return { success: true, message: '상한가 도달! 낙찰되었습니다.' };
    }

    this.notify(eventType, productId);
    return { success: true, message: '입찰이 완료되었습니다.' };
  }

  // Buyer Tool: Quick Close (Instant Win)
  quickCloseAuction(productId: string, userId: string): { success: boolean; message: string } {
    const product = this.products.find(p => p.id === productId);
    const user = this.users.find(u => u.id === userId);

    if (!product || !user) return { success: false, message: 'Error' };
    
    // Validation: Only buyers can use tickets, Seller cannot buy their own item
    if (product.sellerId === userId) return { success: false, message: '판매자는 본인의 상품을 즉시 낙찰받을 수 없습니다.' };
    
    if (user.quickCloseTickets <= 0) return { success: false, message: '사용 가능한 티켓이 없습니다. 구독을 통해 충전해주세요.' };
    if (product.status !== ProductStatus.ACTIVE) return { success: false, message: '이미 종료된 경매입니다.' };

    // Buyer wins immediately at current price
    product.status = ProductStatus.SOLD;
    product.winnerId = user.id;
    
    // Create a system bid to record the win
    const winningBid: Bid = {
        id: 'ticket-' + Date.now(),
        bidderId: user.id,
        bidderName: user.name,
        amount: product.currentPrice,
        timestamp: Date.now()
    };
    product.bids.push(winningBid);

    user.quickCloseTickets -= 1;

    this.notify('AUCTION_CLOSED', productId);
    return { success: true, message: '프리미엄 티켓을 사용하여 즉시 낙찰받았습니다!' };
  }

  buyNow(productId: string, buyerId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.status !== ProductStatus.ACTIVE) return false;
    
    product.status = ProductStatus.SOLD;
    product.winnerId = buyerId;
    return true;
  }
}

export const store = new MockStore();