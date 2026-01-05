import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../services/mockStore';
import { Product, ProductStatus } from '../types';
import { ChevronLeft, Share, MoreVertical, Heart, X, Wifi, Clock, ArrowUp, Ticket, Crown, Gavel } from 'lucide-react';

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
    
    const interval = setInterval(() => setNow(Date.now()), 1000);
    
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

  if (!product) return <div className="p-10 text-center text-gray-500">존재하지 않는 보물입니다.</div>;

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
    <div className="bg-[#2C2C2C] pb-32 md:pb-10 relative min-h-screen">
      {/* Mobile Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center md:hidden">
          <button onClick={() => navigate(-1)} className="text-white drop-shadow-md bg-black/40 p-2 rounded-full backdrop-blur-sm"><ChevronLeft size={24} /></button>
          <div className="flex gap-4 text-white drop-shadow-md">
             <button className="bg-black/40 p-2 rounded-full backdrop-blur-sm"><Share size={20} /></button>
             <button className="bg-black/40 p-2 rounded-full backdrop-blur-sm"><MoreVertical size={20} /></button>
          </div>
      </div>

      {/* Product Image Area */}
      <div className="w-full aspect-square md:aspect-video bg-gray-800 relative">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          
          {/* Real-time Status Badge */}
          <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-xs font-bold text-white">{isConnected ? 'LIVE 접속중' : '연결 끊김'}</span>
          </div>

          {product.status !== ProductStatus.ACTIVE && (
             <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <span className="text-goblin-red font-heading font-black text-3xl border-4 border-goblin-red p-4 rounded-lg transform -rotate-12 bg-black/50 backdrop-blur-sm">
                    {product.status === ProductStatus.SOLD ? '낙찰완료' : '경매종료'}
                </span>
             </div>
          )}
      </div>

      <div className="max-w-4xl mx-auto md:mt-8 md:px-4">
        {/* Content Container */}
        <div className="bg-antique-white md:rounded-lg overflow-hidden text-[#2C2C2C]">
            
            {/* Live Timer & Connection */}
            <div className="bg-[#222] p-4 text-white flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <Clock className="text-treasure-gold" size={20}/>
                  {isEnded ? (
                    <span className="font-bold text-gray-400">종료된 경매</span>
                  ) : (
                    <div className="font-mono font-bold text-lg tracking-wider">
                       {days > 0 ? `${days}일 ` : ''} 
                       {String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}
                       <span className="text-xs text-gray-400 font-sans ml-1">남음</span>
                    </div>
                  )}
               </div>
               
               <div className="flex items-center gap-1.5 md:hidden">
                  <Wifi size={14} className={isConnected ? "text-green-500" : "text-red-500"} />
                  <span className="text-[10px] text-gray-400">{isConnected ? '실시간' : '연결중...'}</span>
               </div>
            </div>

            {/* Seller Info */}
            <div className="px-4 py-4 flex items-center border-b border-gray-300 bg-[#EFEFDE]">
                <div className="w-10 h-10 rounded-full bg-[#2C2C2C] overflow-hidden mr-3 border border-gray-400">
                    <div className="w-full h-full flex items-center justify-center text-treasure-gold font-bold text-lg">{product.sellerName[0]}</div>
                </div>
                <div>
                    <div className="font-bold text-[#2C2C2C]">{product.sellerName}</div>
                    <div className="text-xs text-gray-500">도깨비 상인 · {new Date(product.createdAt).toLocaleDateString()} 등록</div>
                </div>
            </div>

            {/* Price Transparency */}
            {product.type === 'AUCTION' && (
                <div className="px-4 py-6 bg-[#E8E8D0] border-b border-gray-300">
                    <h3 className="font-bold text-[#2C2C2C] mb-3 text-sm flex items-center gap-1">💰 감정가 정보</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/50 p-3 rounded-lg border border-gray-300 text-center">
                            <div className="text-[10px] text-gray-500 mb-1">정가 (원가)</div>
                            <div className="font-bold text-gray-700 text-sm">{product.originalPrice ? `${product.originalPrice.toLocaleString()}원` : '-'}</div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg border border-gray-300 text-center">
                            <div className="text-[10px] text-gray-500 mb-1">매입가</div>
                            <div className="font-bold text-gray-700 text-sm">{product.costPrice ? `${product.costPrice.toLocaleString()}원` : '-'}</div>
                        </div>
                        <div className="bg-white/80 p-3 rounded-lg border border-yellow-400 text-center relative overflow-hidden ring-1 ring-yellow-400">
                            <div className="text-[10px] text-yellow-700 font-bold mb-1 relative z-10">전문가 감정가</div>
                            <div className="font-black text-goblin-red text-sm relative z-10">{product.appraisedValue ? `${product.appraisedValue.toLocaleString()}원` : '-'}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Info */}
            <div className="p-4 border-b border-gray-300">
                <div className="text-sm text-gray-600 mb-1 font-medium">{product.category}</div>
                <h1 className="text-2xl font-heading text-[#2C2C2C] mb-4 leading-tight">{product.title}</h1>
                
                {/* Prominent Current Price Section */}
                <div className="mb-6 bg-gray-100 p-4 rounded-lg flex items-center justify-between border border-gray-200">
                    <div>
                        <span className="text-xs font-bold text-gray-500 block mb-1">현재 최고 입찰가</span>
                        <span className="text-3xl font-black text-goblin-red tracking-tight flex items-baseline gap-1">
                            {product.currentPrice.toLocaleString()}<span className="text-lg text-gray-400 font-bold">원</span>
                        </span>
                    </div>
                    <div className="text-right">
                         <span className="text-xs font-bold text-gray-500 block mb-1">입찰 경쟁</span>
                         <span className="text-lg font-bold text-[#2C2C2C] flex items-center gap-1 justify-end">
                            {product.bids.length}명 <span className="text-xs font-normal text-gray-400">참여중</span>
                         </span>
                    </div>
                </div>

                <div className="prose prose-sm text-gray-800 whitespace-pre-line leading-relaxed mb-6 font-sans">
                    {product.description}
                </div>

                {product.originalPrice && (
                    <div className="mt-4 pt-4 border-t border-gray-300 flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-bold text-gray-600">정가 (Original Price):</span>
                        <span className="line-through">{product.originalPrice.toLocaleString()}원</span>
                    </div>
                )}
            </div>

            {/* Bid History (Refined) */}
            <div className="p-4 bg-antique-white">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold text-[#2C2C2C] flex items-center gap-2">
                        📜 입찰 기록
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 ${priceUpdated ? 'bg-goblin-red text-white scale-110' : 'bg-gray-200 text-gray-600'}`}>
                        총 {sortedBids.length}건
                    </span>
                </div>
                
                <div className="bg-white rounded-xl shadow-inner border border-gray-200 overflow-hidden relative">
                     {/* Update Flash Overlay for List */}
                     <div className={`absolute inset-0 bg-treasure-gold/10 pointer-events-none z-10 transition-opacity duration-500 ${priceUpdated ? 'opacity-100' : 'opacity-0'}`}></div>

                    {sortedBids.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                            {sortedBids.map((bid, idx) => {
                                const isTopBid = idx === 0;
                                const isMe = bid.bidderId === currentUser?.id;
                                
                                return (
                                    <div 
                                        key={bid.id} 
                                        className={`
                                            flex justify-between items-center p-3 text-sm border-b border-gray-100 last:border-0 transition-colors duration-300
                                            ${isTopBid ? 'bg-red-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
                                            ${priceUpdated && isTopBid ? 'animate-pulse' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm shrink-0
                                                ${isTopBid ? 'bg-goblin-red text-white ring-2 ring-red-200' : 'bg-gray-200 text-gray-500'}
                                            `}>
                                                {isTopBid ? <Crown size={14} fill="currentColor"/> : idx + 1}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`font-bold ${isTopBid ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {bid.bidderName}
                                                    </span>
                                                    {isMe && <span className="bg-treasure-gold text-[9px] text-black font-bold px-1.5 rounded-full">나</span>}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className={`font-bold text-base ${isTopBid ? 'text-goblin-red' : 'text-gray-700'}`}>
                                                {bid.amount.toLocaleString()}원
                                            </div>
                                            {isTopBid && (
                                                <div className="text-[10px] text-red-500 font-bold flex items-center justify-end gap-1">
                                                    현재 최고가
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Gavel size={32} className="mb-2 opacity-50"/>
                            <p className="text-sm font-medium">아직 입찰 기록이 없습니다.</p>
                            <p className="text-xs mt-1">첫 번째 입찰자가 되어보세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar (Updated Layout) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#2C2C2C] border-t border-gray-700 p-3 pb-safe z-[60] md:sticky md:bottom-0 md:border md:rounded-lg md:shadow-lg md:mx-4 md:mb-4 md:max-w-4xl md:mx-auto">
         <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between max-w-4xl mx-auto px-2 gap-3 md:gap-0">
             
             {/* Price Section */}
             <div className="flex items-center justify-between md:justify-start md:gap-6 flex-1">
                 <button className="flex flex-col items-center justify-center text-gray-400 px-2 md:border-r md:border-gray-700 md:pr-4 hover:text-goblin-red transition shrink-0">
                    <Heart size={24} />
                    <span className="text-[10px]">찜</span>
                 </button>
                 
                 <div className="flex flex-col items-end md:items-start">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 whitespace-nowrap">
                        <span>시작가 {product.startPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5 relative">
                        <span className="text-xs text-treasure-gold font-bold md:hidden">현재가</span>
                        <div className={`font-black text-2xl md:text-xl leading-none transition-all duration-300 ${priceUpdated ? 'text-treasure-gold scale-110' : 'text-white'}`}>
                            {product.currentPrice.toLocaleString()}<span className="text-sm font-medium text-gray-400 ml-1">원</span>
                        </div>
                        {priceUpdated && <ArrowUp size={20} className="text-goblin-red animate-bounce" />}
                    </div>
                 </div>
             </div>
             
             {/* Button Section */}
             {isSeller ? (
                <button className="w-full md:w-auto bg-gray-600 text-gray-300 font-bold px-6 py-3 rounded-lg text-sm cursor-not-allowed shrink-0">
                   내 물건
                </button>
             ) : (
                <button 
                  onClick={() => setIsBidModalOpen(true)}
                  disabled={product.status !== ProductStatus.ACTIVE}
                  className={`w-full md:w-auto font-bold px-6 py-3 rounded-lg text-base transition-all shadow-lg transform active:scale-95 shrink-0 ${product.status === ProductStatus.ACTIVE ? 'bg-goblin-red hover:bg-red-700 text-white shadow-red-900/40' : 'bg-gray-600 text-gray-400 shadow-none'}`}
                >
                   {product.status === ProductStatus.ACTIVE ? '입찰하기' : '종료됨'}
                </button>
             )}
         </div>
      </div>

      {/* Bid Modal */}
      {isBidModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsBidModalOpen(false)}></div>
              <div className="bg-antique-white w-full max-w-md rounded-t-[2rem] sm:rounded-lg p-6 z-10 animate-in slide-in-from-bottom-full duration-300 text-[#2C2C2C] max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-heading text-[#2C2C2C]">입찰하기</h3>
                      <button onClick={() => setIsBidModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={24}/></button>
                  </div>

                  {/* Do-kkae-bi Ticket Section */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg mb-6 border border-treasure-gold text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-treasure-gold/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10 mb-3">
                          <div className="flex items-center gap-2">
                             <div className="bg-treasure-gold text-black p-1.5 rounded">
                                <Ticket size={16} />
                             </div>
                             <span className="font-bold text-treasure-gold">도깨비 감투</span>
                          </div>
                          <span className="text-sm font-medium text-gray-400">보유: <span className="text-white font-bold">{currentUser?.quickCloseTickets || 0}장</span></span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                          경매 마감까지 기다릴 필요 없이,<br/>
                          <span className="text-treasure-gold font-bold">현재 가격에 즉시 낙찰</span>받을 수 있습니다.
                      </p>
                      <button 
                        onClick={handleQuickClose}
                        disabled={(currentUser?.quickCloseTickets || 0) <= 0}
                        className="w-full bg-treasure-gold hover:bg-yellow-400 text-black font-black py-2.5 rounded text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                         감투 쓰고 즉시 낚아채기
                      </button>
                  </div>

                  <hr className="border-gray-300 mb-6" />

                  {/* Manual Bid Section */}
                  <div className="mb-6">
                      <label className="block text-xs font-bold text-gray-600 mb-2">입찰 희망가 (현재가 {product.currentPrice.toLocaleString()}원)</label>
                      <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-4 text-xl font-black text-[#2C2C2C] outline-none focus:ring-2 focus:ring-goblin-red"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                          />
                      </div>
                      <button 
                        onClick={() => setBidAmount(maxPrice)}
                        className="mt-2 text-xs font-bold text-goblin-red flex items-center gap-1 hover:underline"
                      >
                        <ArrowUp size={12}/> 상한가(즉시낙찰) {maxPrice.toLocaleString()}원으로 입력
                      </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-8">
                      <button onClick={() => adjustBid(1000)} className="py-3 rounded-lg bg-[#EFEFDE] text-gray-800 font-bold text-sm hover:bg-gray-200 transition border border-gray-300">+ 1천원</button>
                      <button onClick={() => adjustBid(5000)} className="py-3 rounded-lg bg-[#EFEFDE] text-gray-800 font-bold text-sm hover:bg-gray-200 transition border border-gray-300">+ 5천원</button>
                      <button onClick={() => adjustBid(10000)} className="py-3 rounded-lg bg-[#EFEFDE] text-gray-800 font-bold text-sm hover:bg-gray-200 transition border border-gray-300">+ 1만원</button>
                  </div>

                  <button 
                    onClick={handlePlaceBid}
                    className="w-full bg-goblin-red text-white font-bold py-4 rounded-lg text-lg hover:bg-red-800 transition shadow-xl"
                  >
                      {bidAmount >= maxPrice ? '상한가로 즉시 낙찰받기' : '입찰 확정'}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};