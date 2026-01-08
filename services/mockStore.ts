import { INITIAL_PRODUCTS, MOCK_USERS } from '../constants';
import { Product, User, Bid, ProductType, ProductStatus, UserRole, Report, ReportStatus } from '../types';

type StoreEvent = {
  type: 'BID_UPDATE' | 'AUCTION_CLOSED' | 'USER_UPDATE' | 'REPORT_UPDATE';
  productId?: string;
  product?: Product;
  user?: User | null;
};

type StoreListener = (event: StoreEvent) => void;

class MockStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private users: User[] = [];
  private currentUser: User | null = null;
  private listeners: Set<StoreListener> = new Set();
  private channel: BroadcastChannel;
  
  // Mock Reports
  private reports: Report[] = [
      {
          id: 'r1',
          targetId: 'p1',
          targetType: 'PRODUCT',
          reporterId: 'user2',
          reason: '가품이 의심됩니다. 전문가 감정 다시 해주세요.',
          status: ReportStatus.PENDING,
          timestamp: Date.now() - 10000000
      },
      {
          id: 'r2',
          targetId: 'user1',
          targetType: 'USER',
          reporterId: 'user2',
          reason: '채팅에서 욕설을 했습니다.',
          status: ReportStatus.RESOLVED,
          timestamp: Date.now() - 50000000
      }
  ];
  
  // In-memory password storage (synced to LS)
  private credentials = new Map<string, string>();

  constructor() {
    // 1. Initialize Users
    const storedUsers = localStorage.getItem('bomul_users');
    if (storedUsers) {
        try {
            this.users = JSON.parse(storedUsers);
        } catch(e) {
            this.users = [...MOCK_USERS];
        }
    } else {
        this.users = [...MOCK_USERS];
    }

    // 2. Initialize Credentials
    const storedCreds = localStorage.getItem('bomul_credentials');
    if (storedCreds) {
        try {
            const credObj = JSON.parse(storedCreds);
            this.credentials = new Map(Object.entries(credObj));
        } catch(e) {
            this.initDefaultCredentials();
        }
    } else {
        this.initDefaultCredentials();
    }

    // 3. Initialize Current User
    const savedUserId = localStorage.getItem('bomul_current_user_id');
    if (savedUserId) {
      this.currentUser = this.users.find(u => u.id === savedUserId) || null; 
    } else {
      this.currentUser = null; 
    }

    // 4. Initialize BroadcastChannel
    this.channel = new BroadcastChannel('bomul_auction_updates');
    this.channel.onmessage = (event) => {
      const { type, productId, product, user } = event.data;
      if (type === 'USER_UPDATE') {
          // Sync user state across tabs if needed, though mostly local
      } else {
          this.handleRemoteUpdate(type as any, productId!, product!);
      }
    };
  }

  private initDefaultCredentials() {
      this.credentials.set('admin', 'admin123!');
      this.credentials.set('user1', 'admin123!');
      this.credentials.set('user2', 'admin123!');
      this.saveCredentials();
  }

  private saveUsers() {
      localStorage.setItem('bomul_users', JSON.stringify(this.users));
  }

  private saveCredentials() {
      const obj = Object.fromEntries(this.credentials);
      localStorage.setItem('bomul_credentials', JSON.stringify(obj));
  }

  // Real-time Subscription
  subscribe(listener: StoreListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private handleRemoteUpdate(type: 'BID_UPDATE' | 'AUCTION_CLOSED', productId: string, updatedProduct: Product) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products[index] = updatedProduct;
      this.notify('BID_UPDATE', { productId, product: { ...updatedProduct } }, true); 
    }
  }

  private notify(type: StoreEvent['type'], data: { productId?: string, product?: Product, user?: User | null } = {}, fromRemote: boolean = false) {
    const event: StoreEvent = { type, ...data };
    this.listeners.forEach(listener => listener(event));
    if (!fromRemote) {
      this.channel.postMessage(event);
    }
  }

  // User Methods
  getCurrentUser() {
    return this.currentUser;
  }
  
  getUserById(id: string) {
      return this.users.find(u => u.id === id);
  }

  validateUser(id: string, password: string): boolean {
      const user = this.getUserById(id);
      if (!user) return false;
      const storedPassword = this.credentials.get(id);
      return storedPassword === password;
  }

  setCurrentUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('bomul_current_user_id', userId);
    } else {
      this.currentUser = null;
      localStorage.removeItem('bomul_current_user_id');
    }
    this.notify('USER_UPDATE', { user: this.currentUser });
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('bomul_current_user_id');
    this.notify('USER_UPDATE', { user: null });
  }

  registerUser(user: User, password: string) {
    const newUser = {
        ...user,
        ticketsPurchasedMonth: user.ticketsPurchasedMonth || 0,
        quickCloseTickets: user.quickCloseTickets || 0,
        xp: 0
    };
    this.users.push(newUser);
    this.credentials.set(newUser.id, password);
    
    this.saveUsers();
    this.saveCredentials();

    this.currentUser = newUser;
    localStorage.setItem('bomul_current_user_id', newUser.id);
    this.notify('USER_UPDATE', { user: newUser });
  }

  subscribeUser(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.isSubscribed = true;
      this.saveUsers();
      this.notify('USER_UPDATE', { user });
    }
  }
  
  buyTicket(userId: string): { success: boolean; message: string } {
      const user = this.users.find(u => u.id === userId);
      if (!user) return { success: false, message: 'User not found' };
      
      const currentPurchased = user.ticketsPurchasedMonth || 0;
      const MAX_MONTHLY = 3;
      
      if (currentPurchased >= MAX_MONTHLY) {
          return { success: false, message: `이번 달 구매 한도(${MAX_MONTHLY}장)를 초과하였습니다.` };
      }
      
      user.quickCloseTickets = (user.quickCloseTickets || 0) + 1;
      user.ticketsPurchasedMonth = currentPurchased + 1;
      
      this.saveUsers();
      this.notify('USER_UPDATE', { user });
      return { success: true, message: '도깨비 감투를 구매하였습니다.' };
  }

  // LEVEL SYSTEM LOGIC
  getLevelInfo(xp: number) {
    // Lv.1: 0 - 100
    // Lv.2: 101 - 400
    // Lv.3: 401+
    if (xp <= 100) {
        return { level: 1, title: '보따리 상인', nextXp: 100, progress: (xp / 100) * 100 };
    } else if (xp <= 400) {
        return { level: 2, title: '거상', nextXp: 400, progress: ((xp - 100) / 300) * 100 };
    } else {
        return { level: 3, title: '도깨비 상인', nextXp: 1000, progress: 100 };
    }
  }

  addXp(userId: string, amount: number) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
          user.xp = (user.xp || 0) + amount;
          this.saveUsers();
          if (this.currentUser?.id === userId) {
             this.notify('USER_UPDATE', { user });
          }
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
    this.addXp(product.sellerId, 30); // Grant 30 XP for listing
  }

  deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
  }

  // Report Methods
  getReports() {
      return this.reports;
  }

  addReport(reportData: { targetId: string, targetType: 'PRODUCT' | 'USER', reporterId: string, reason: string }) {
      const newReport: Report = {
          ...reportData,
          id: 'r' + Date.now() + Math.random().toString(36).substr(2, 5),
          status: ReportStatus.PENDING,
          timestamp: Date.now()
      };
      this.reports.unshift(newReport);
      this.notify('REPORT_UPDATE');
  }

  updateReportStatus(id: string, status: ReportStatus) {
      const report = this.reports.find(r => r.id === id);
      if(report) {
          report.status = status;
          this.notify('REPORT_UPDATE');
      }
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

    const basePrice = product.costPrice || product.startPrice;
    const maxPrice = basePrice * 10;
    
    const newBid: Bid = {
      id: Math.random().toString(36).substr(2, 9),
      bidderId: bidder.id,
      bidderName: bidder.name,
      amount: amount,
      timestamp: Date.now()
    };
    
    product.bids.push(newBid);
    product.currentPrice = amount;

    // Grant XP to bidder
    this.addXp(bidder.id, 10);

    let eventType: 'BID_UPDATE' | 'AUCTION_CLOSED' = 'BID_UPDATE';
    if (amount >= maxPrice) {
      product.status = ProductStatus.SOLD;
      product.winnerId = bidder.id;
      eventType = 'AUCTION_CLOSED';
      this.addXp(bidder.id, 50); // Extra XP for winning
      this.notify(eventType, { productId, product });
      return { success: true, message: '상한가 도달! 즉시 낙찰되었습니다. (+60XP)' };
    }

    this.notify(eventType, { productId, product });
    return { success: true, message: '입찰이 완료되었습니다. (+10XP)' };
  }

  quickCloseAuction(productId: string, userId: string): { success: boolean; message: string } {
    const product = this.products.find(p => p.id === productId);
    const user = this.users.find(u => u.id === userId);

    if (!product || !user) return { success: false, message: 'Error' };
    
    if (product.sellerId === userId) return { success: false, message: '판매자는 본인의 상품을 즉시 낙찰받을 수 없습니다.' };
    
    if ((user.quickCloseTickets || 0) <= 0) return { success: false, message: '사용 가능한 티켓이 없습니다. 티켓을 구매해주세요.' };
    if (product.status !== ProductStatus.ACTIVE) return { success: false, message: '이미 종료된 경매입니다.' };

    product.status = ProductStatus.SOLD;
    product.winnerId = user.id;
    
    const winningBid: Bid = {
        id: 'ticket-' + Date.now(),
        bidderId: user.id,
        bidderName: user.name,
        amount: product.currentPrice,
        timestamp: Date.now()
    };
    product.bids.push(winningBid);

    user.quickCloseTickets = (user.quickCloseTickets || 0) - 1;
    this.addXp(user.id, 50); // XP for winning

    this.notify('AUCTION_CLOSED', { productId, product });
    this.notify('USER_UPDATE', { user }); // Update ticket count
    this.saveUsers(); // Save ticket usage
    return { success: true, message: '도깨비 감투를 사용하여 즉시 낙찰받았습니다! (+50XP)' };
  }

  buyNow(productId: string, buyerId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.status !== ProductStatus.ACTIVE) return false;
    
    product.status = ProductStatus.SOLD;
    product.winnerId = buyerId;
    this.addXp(buyerId, 50);
    return true;
  }
}

export const store = new MockStore();