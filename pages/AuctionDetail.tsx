import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { Product, ProductStatus } from '../types';
import { ChevronLeft, Share, Heart, X, Wifi, Clock, ArrowUp, Ticket, Crown, Gavel, AlertCircle, TrendingUp } from 'lucide-react';

export const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(store.getProductById(id!));
  const [now, setNow] = useState(Date.now());
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(0);

  // WebSocket / Real-time States
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdated, setPriceUpdated] = useState(false);

  const currentUser = store.getCurrentUser();
  const isSeller = currentUser && product && currentUser.id === product.sellerId;

  // Calculate Max Price (10x Cost Price or Start Price)
  const basePrice = product ? (product.costPrice || product.startPrice) : 0;
  const maxPrice = basePrice * 10;

  useEffect(() => {
    // Simulate connecting to WebSocket
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 500);

    const unsubscribe = store.subscribe((event) => {
      if (event.productId === id && event.product) {
        setProduct(event.product);
        // Trigger visual update effect
        setPriceUpdated(true);
        setTimeout(() => setPriceUpdated(false), 2000);
      }
    });
    
    // Timer interval for countdown
    const interval = setInterval(() => {
        setNow(Date.now());
    }, 1000);
    
    return () => {
      clearTimeout(connectTimer);
      unsubscribe();
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [id]);

  useEffect(() => {
    if(product) setBidAmount(product.currentPrice + 1000);
  }, [product?.currentPrice]);

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 bg-vintage-charcoal">
        <AlertCircle size={48} className="mb-4 opacity-50"/>
        <p>존재하지 않는 보물입니다.</p>
        <button onClick={() => navigate('/auctions')} className="mt-4 text-treasure-gold font-bold hover:underline">목록으로 돌아가기</button>
    </div>
  );

  const handlePlaceBid = () => {
      if (!currentUser) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
      }
      if (isSeller) {
          alert('판매자는 본인의 상품에 입찰할 수 없습니다.');
          return;
      }
      
      const result = store.placeBid(product.id, bidAmount, currentUser);
      if(result.success) {
          alert(result.message);
          setIsBidModalOpen(false);
      } else {
          alert(result.message);
      }
  };

  const handleQuickClose = () => {
      if (!currentUser) return;
      if (confirm(`도깨비 감투 1장을 사용하여 현재 가격(${product.currentPrice.toLocaleString()}원)에 즉시 낙찰받으시겠습니까?`)) {
          const result = store.quickCloseAuction(product.id, currentUser.id);
          if (result.success) {
              alert(result.message);
              setIsBidModalOpen(false);
          } else {
              alert(result.message);
          }
      }
  };

  const adjustBid = (amount: number) => {
      setBidAmount(prev => Math.max(product.currentPrice + 1000, prev + amount));
  };

  const sortedBids = [...product.bids].sort((a,b) => b.timestamp - a.timestamp);

  // Countdown Logic
  const timeLeft = Math.max(0, product.endsAt - now);
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const isEnded = timeLeft <= 0;

  return (
    <div className="bg-vintage-charcoal min-h-screen pb-32 md:pb-12 relative">
      
      {/* Mobile Header (Floating with Safe Area Fix) */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] flex justify-between items-center md:hidden pointer-events-none">
          <button onClick={() => navigate(-1)} className="pointer-events-auto text-white drop-shadow-md bg-black/30 p-2 rounded-full backdrop-blur-md hover:bg-black/50 transition border border-white/10"><ChevronLeft size={24} /></button>
          <div className="flex gap-3 pointer-events-auto">
             <button className="text-white drop-shadow-md bg-black/30 p-2 rounded-full backdrop-blur-md hover:bg-black/50 transition border border-white/10"><Share size={20} /></button>
          </div>
      </div>

      <div className="max-w-6xl mx-auto md:pt-8 md:px-4 lg:flex lg:gap-8">
        
        {/* Left Column: Image */}
        <div className="lg:w-[55%] relative">
             <div className="w-full aspect-[4/3] md:rounded-2xl overflow-hidden bg-[#222] shadow-2xl relative group">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                {/* Live Status Badge */}
                <div className="absolute top-[calc(env(safe-area-inset-top)+4rem)] md:top-4 left-4 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                   <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <span className="text-[11px] font-bold text-white tracking-wide">{isConnected ? 'LIVE AUCTION' : 'OFFLINE'}</span>
                </div>

                {/* Status Overlay */}
                {product.status !== ProductStatus.ACTIVE && (
                   <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 animate-in fade-in duration-500">
                      <div className="text-center transform rotate-[-12deg] border-4 border-goblin-red p-6 rounded-xl bg-black/50 shadow-2xl">
                          <span className="text-goblin-red font-heading font-black text-4xl md:text-5xl uppercase tracking-widest drop-shadow-lg">
                              {product.status === ProductStatus.SOLD ? 'SOLD OUT' : 'CLOSED'}
                          </span>
                      </div>
                   </div>
                )}
             </div>
             
             {/* Desktop Back Button */}
             <button onClick={() => navigate(-1)} className="hidden md:flex absolute -top-12 left-0 text-gray-400 hover:text-white items-center gap-1 font-bold transition">
                <ChevronLeft size={20}/> 돌아가기
             </button>
        </div>

        {/* Right Column: Info Card (The "Paper") */}
        <div className="lg:w-[45%] mt-6 lg:mt-0 relative z-10">
            <div className="bg-antique-white rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl text-[#2C2C2C] relative min-h-[600px]">
                {/* Top Decorative Line */}
                <div className="h-1.5 bg-gradient-to-r from-goblin-red via-red-800 to-goblin-red"></div>

                {/* Timer Header */}
                <div className="bg-[#1a1a1a] p-5 flex justify-between items-center text-white border-b border-[#333]">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isEnded ? 'bg-gray-700' : 'bg-red-900/40 text-goblin-red animate-pulse'}`}>
                        <Clock size={20} className={isEnded ? "text-gray-400" : "text-goblin-red"}/>
                      </div>
                      <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Time Remaining</p>
                          {isEnded ? (
                            <span className="font-heading font-bold text-gray-400 text-lg">경매 종료</span>
                          ) : (
                            <div className="font-mono font-bold text-xl tracking-widest text-treasure-gold tabular-nums">
                               {days > 0 && <span>{days}d </span>}
                               {String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
                            </div>
                          )}
                      </div>
                   </div>
                   <div className="hidden md:flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                      <Wifi size={14} className={isConnected ? "text-green-500" : "text-red-500"} />
                      <span className="text-[10px] text-gray-400 font-bold">{isConnected ? '실시간 연결됨' : '연결 중...'}</span>
                   </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto max-h-[calc(100vh-350px)] lg:max-h-[600px] pb-24">
                    
                    {/* Seller & Title */}
                    <div className="p-6 md:p-8 border-b border-gray-200/60">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black text-treasure-gold flex items-center justify-center font-bold text-sm shadow-md">
                                {product.sellerName[0]}
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-gray-800 block">{product.sellerName}</span>
                                <span className="text-gray-500">도깨비 상인 · 신용도 높음</span>
                            </div>
                        </div>
                        
                        <div className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-600 text-[10px] font-bold mb-2">
                            {product.category}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>
                        <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                            {product.description}
                        </p>
                    </div>

                    {/* Price Spec Sheet (Certificate Style) */}
                    <div className="px-6 py-6 bg-[#E8E8D0]/50 border-b border-gray-200/60">
                        <div className="flex items-center gap-2 mb-4">
                             <TrendingUp size={16} className="text-gray-500"/>
                             <h3 className="font-bold text-gray-700 text-sm">감정가 분석 보고서</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded border border-gray-200 text-center shadow-sm">
                                <div className="text-[10px] text-gray-400 font-bold mb-1">정가 (Market Price)</div>
                                <div className="font-bold text-gray-600 text-sm line-through decoration-gray-400/50">
                                    {product.originalPrice ? product.originalPrice.toLocaleString() : '-'}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded border border-gray-200 text-center shadow-sm">
                                <div className="text-[10px] text-gray-400 font-bold mb-1">매입가 (Cost)</div>
                                <div className="font-bold text-gray-600 text-sm">
                                    {product.costPrice ? product.costPrice.toLocaleString() : '-'}
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded border border-treasure-gold/50 text-center shadow-sm relative overflow-hidden ring-2 ring-treasure-gold/20">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-treasure-gold/20 rounded-bl-full"></div>
                                <div className="text-[10px] text-yellow-700 font-black mb-1 relative z-10">전문가 감정가</div>
                                <div className="font-black text-goblin-red text-sm relative z-10">
                                    {product.appraisedValue ? product.appraisedValue.toLocaleString() : '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bid History (Ledger Style) */}
                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-heading font-bold text-gray-800 flex items-center gap-2">
                                <Gavel size={18}/> 입찰 기록부
                            </h3>
                            <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                {sortedBids.length} bids
                            </span>
                        </div>

                        <div className="space-y-3 relative">
                            {/* Connecting Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200"></div>

                            {sortedBids.length > 0 ? (
                                sortedBids.map((bid, idx) => {
                                    const isTop = idx === 0;
                                    return (
                                        <div key={bid.id} className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all ${isTop ? 'bg-white border-red-100 shadow-md' : 'bg-transparent border-transparent opacity-70'}`}>
                                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 ${isTop ? 'bg-goblin-red border-goblin-red text-white shadow-lg scale-110' : 'bg-gray-200 border-white text-gray-500'}`}>
                                                {isTop ? <Crown size={14} fill="currentColor"/> : idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <span className={`font-bold text-sm truncate ${isTop ? 'text-gray-900' : 'text-gray-600'}`}>{bid.bidderName}</span>
                                                    <span className={`font-black text-base tabular-nums ${isTop ? 'text-goblin-red' : 'text-gray-500'}`}>
                                                        {bid.amount.toLocaleString()}원
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-mono">
                                                    {new Date(bid.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-400 text-xs font-medium">아직 입찰 기록이 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-[60] bg-gradient-to-t from-black via-black/90 to-transparent pt-10 pb-safe pointer-events-none">
         <div className="max-w-4xl mx-auto bg-[#222] border border-gray-700 rounded-2xl p-2 pl-6 shadow-2xl flex items-center justify-between pointer-events-auto relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-0 left-0 w-1/2 h-full bg-treasure-gold/5 blur-xl"></div>
             
             <div className="relative z-10">
                 <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 tracking-wider">Current Bid</div>
                 <div className="flex items-center gap-2">
                    <span className={`text-2xl font-black tabular-nums transition-all ${priceUpdated ? 'text-treasure-gold scale-110' : 'text-white'}`}>
                        {product.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-gray-500">원</span>
                    {priceUpdated && <ArrowUp size={16} className="text-goblin-red animate-bounce"/>}
                 </div>
             </div>

             <div className="flex gap-2">
                 <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#333] hover:bg-[#444] text-gray-400 hover:text-goblin-red transition">
                     <Heart size={20} />
                 </button>
                 {isSeller ? (
                    <button disabled className="px-6 py-3 bg-gray-700 text-gray-400 font-bold rounded-xl text-sm cursor-not-allowed">
                        내 상품
                    </button>
                 ) : (
                    <button 
                        onClick={() => setIsBidModalOpen(true)}
                        disabled={product.status !== ProductStatus.ACTIVE}
                        className={`px-8 py-3 rounded-xl font-bold text-sm md:text-base shadow-lg transition transform active:scale-95 ${product.status === ProductStatus.ACTIVE ? 'bg-goblin-red hover:bg-red-700 text-white shadow-red-900/30' : 'bg-gray-600 text-gray-300 cursor-not-allowed'}`}
                    >
                        {product.status === ProductStatus.ACTIVE ? '입찰하기' : '경매 종료'}
                    </button>
                 )}
             </div>
         </div>
      </div>

      {/* Bid Modal (Revised for Safe Area & Overflow) */}
      {isBidModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsBidModalOpen(false)}></div>
              <div className="bg-antique-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 pb-safe z-10 animate-in slide-in-from-bottom-10 duration-300 text-[#2C2C2C] relative overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto">
                  
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-heading font-bold text-gray-900">입찰 참여</h3>
                      <button onClick={() => setIsBidModalOpen(false)} className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition"><X size={20}/></button>
                  </div>

                  {/* Ticket Promo */}
                  <div className="bg-[#1a1a1a] p-5 rounded-xl mb-6 relative overflow-hidden group border border-treasure-gold/30">
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-treasure-gold/20 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2 text-treasure-gold font-bold">
                                 <Ticket size={16}/> <span>도깨비 감투</span>
                             </div>
                             <div className="bg-[#333] px-2 py-0.5 rounded text-[10px] text-white font-bold">
                                 보유: {currentUser?.quickCloseTickets || 0}
                             </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                              경매 종료를 기다릴 필요 없이<br/> 
                              <span className="text-white font-bold underline decoration-treasure-gold">현재 가격으로 즉시 낙찰</span>받습니다.
                          </p>
                          <button 
                            onClick={handleQuickClose}
                            disabled={(currentUser?.quickCloseTickets || 0) <= 0}
                            className="w-full py-2.5 bg-treasure-gold hover:bg-yellow-400 text-black font-black rounded-lg text-xs transition disabled:opacity-50 disabled:grayscale"
                          >
                             감투 사용하기
                          </button>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">입찰 금액 설정</label>
                          <div className="relative">
                              <input 
                                type="number" 
                                className="w-full bg-white border-2 border-gray-200 focus:border-goblin-red rounded-xl px-4 py-4 text-2xl font-black text-gray-900 outline-none tabular-nums transition-colors shadow-inner"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(Number(e.target.value))}
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">KRW</span>
                          </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                          {[1000, 5000, 10000].map(amt => (
                              <button key={amt} onClick={() => adjustBid(amt)} className="py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 transition border border-gray-200">
                                  +{amt.toLocaleString()}원
                              </button>
                          ))}
                      </div>

                      <button 
                        onClick={handlePlaceBid}
                        className="w-full bg-goblin-red hover:bg-red-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-red-900/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                          {bidAmount >= maxPrice ? '즉시 낙찰받기' : `${bidAmount.toLocaleString()}원 입찰하기`}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};