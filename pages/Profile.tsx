import React, { useState, useEffect } from 'react';
import { store } from '../services/mockStore';
import { 
  Settings, 
  ChevronRight, 
  Ticket, 
  Heart, 
  FileText, 
  ShoppingBag, 
  LogOut, 
  Bell, 
  HelpCircle, 
  ShieldCheck, 
  CreditCard,
  MapPin,
  Camera,
  Gavel,
  X,
  TrendingUp,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(store.getCurrentUser());
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [showLevelGuide, setShowLevelGuide] = useState(false);

  useEffect(() => {
    // Initial fetch to be safe
    setUser(store.getCurrentUser());

    // Subscribe to store for realtime updates (ticket purchase, logout etc)
    const unsubscribe = store.subscribe((event) => {
      if (event.type === 'USER_UPDATE') {
        setUser(event.user || null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <div className="p-10 text-center font-bold text-gray-500">로그인이 필요합니다.</div>;

  const handleBuyTicket = () => {
     if (confirm('도깨비 감투 1장을 3,000원에 구매하시겠습니까?')) {
        setPurchaseLoading(true);
        setTimeout(() => {
            const result = store.buyTicket(user.id);
            alert(result.message);
            setPurchaseLoading(false);
            // No reload needed; store subscription will update UI
        }, 1000);
     }
  };

  const handleLogout = () => {
    store.logout();
    navigate('/');
    // No reload needed
  };

  // Safe access for defensive coding
  const purchasedCount = user.ticketsPurchasedMonth ?? 0;
  const monthlyLimit = 3;
  const remainingMonth = Math.max(0, monthlyLimit - purchasedCount);
  
  // Level Calculation
  const levelInfo = store.getLevelInfo(user.xp || 0);

  // Helper Component for Menu Items
  const MenuItem = ({ icon: Icon, text, onClick, rightText, isDestructive = false }: any) => (
    <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between p-4 hover:bg-[#3a3a3a] transition active:bg-[#444] text-left border-b border-[#333] last:border-0"
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon size={22} className={isDestructive ? "text-red-500" : "text-white"} strokeWidth={1.5} />}
            <span className={`text-[15px] font-medium ${isDestructive ? "text-red-500" : "text-white"}`}>{text}</span>
        </div>
        <div className="flex items-center gap-2">
            {rightText && <span className="text-sm text-gray-500 font-medium">{rightText}</span>}
            <ChevronRight size={18} className="text-gray-600" />
        </div>
    </button>
  );

  const SectionTitle = ({ title }: { title: string }) => (
      <h3 className="text-xs font-bold text-gray-400 mt-6 mb-2 px-4">{title}</h3>
  );

  return (
    <div className="pb-20 bg-[#121212] min-h-screen text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sticky top-0 bg-[#121212] z-10">
          <h1 className="text-xl font-bold tracking-tight">나의 보물고물</h1>
          <button className="p-2 hover:bg-[#333] rounded-full transition">
            <Settings size={24} className="text-white" />
          </button>
      </div>

      {/* Profile Card - Enhanced Visibility */}
      <div className="px-4 mb-8">
          <div className="flex items-center gap-5">
              {/* Avatar with Floating Level Badge */}
              <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full bg-[#2C2C2C] border-2 border-[#444] flex items-center justify-center text-3xl overflow-hidden shadow-lg">
                      {user.name?.[0] || '?'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-treasure-gold text-[#121212] text-xs font-black px-2 py-0.5 rounded-md border-2 border-[#121212] shadow-sm z-10">
                      LV.{levelInfo.level}
                  </div>
              </div>

              {/* Info & XP Bar */}
              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-xl font-bold truncate">{user.name}</h2>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${levelInfo.level === 3 ? 'border-goblin-red text-goblin-red bg-red-900/10' : 'border-gray-500 text-gray-400'}`}>
                        {levelInfo.title}
                      </span>
                      <button onClick={() => setShowLevelGuide(true)} className="text-gray-500 hover:text-white transition">
                         <HelpCircle size={18} />
                      </button>
                  </div>
                  
                  {/* XP Section */}
                  <div>
                      <div className="flex justify-between items-end text-xs mb-1.5">
                          <span className="text-treasure-gold font-bold">EXP {user.xp || 0}</span>
                          <span className="text-[10px] text-gray-500 font-medium">
                              {levelInfo.level === 3 ? 'MAX LEVEL' : `다음 레벨까지 ${Math.max(0, levelInfo.nextXp - (user.xp || 0))}`}
                          </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#333] rounded-full overflow-hidden border border-[#444]">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-700 to-treasure-gold rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,215,0,0.3)]" 
                            style={{ width: `${levelInfo.progress}%` }}
                          ></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Ticket (Pay) Section */}
      <div className="px-4 mb-6">
          <div className="bg-[#1E1E1E] rounded-2xl p-5 border border-[#333] relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-treasure-gold/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-5 relative z-10">
                  <div className="flex items-center gap-2">
                       <div className="bg-treasure-gold rounded-md p-1 shadow-sm">
                           <Ticket size={16} className="text-black fill-black" />
                       </div>
                       <span className="font-bold text-lg text-gray-100">도깨비 감투</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{user.quickCloseTickets}</span>
                      <span className="text-sm text-gray-400 font-medium">장 보유</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 relative z-10">
                  <button 
                      onClick={handleBuyTicket}
                      disabled={purchaseLoading || remainingMonth <= 0}
                      className="bg-[#2C2C2C] hover:bg-[#383838] text-treasure-gold py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border border-[#333]"
                  >
                      <span className="bg-treasure-gold/10 p-1 rounded-full"><CreditCard size={14}/></span>
                      {purchaseLoading ? '처리중' : '충전하기'}
                  </button>
                  <button className="bg-[#2C2C2C] hover:bg-[#383838] text-gray-300 py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border border-[#333]">
                      <FileText size={16} className="text-gray-500"/>
                      사용내역
                  </button>
              </div>
              
              <div className="mt-3 text-right">
                  <span className="text-[10px] text-gray-500 font-medium">이번 달 구매 가능: <span className={remainingMonth > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{remainingMonth}</span> / {monthlyLimit}장</span>
              </div>
          </div>
      </div>

      {/* Menu List - My Transactions */}
      <SectionTitle title="나의 거래" />
      <div className="mx-4 bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#2a2a2a]">
          <MenuItem icon={FileText} text="판매내역" onClick={() => navigate('/my-sales')} />
          <MenuItem icon={ShoppingBag} text="구매내역" onClick={() => navigate('/my-purchases')} />
          <MenuItem icon={Gavel} text="입찰 참여 내역" onClick={() => navigate('/my-bids')} />
          <MenuItem icon={ShieldCheck} text="내 물건 가격 찾기" onClick={() => {}} />
      </div>

      {/* Menu List - My Activities */}
      <SectionTitle title="나의 활동" />
      <div className="mx-4 bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#2a2a2a]">
          <MenuItem icon={MapPin} text="동네 인증하기" onClick={() => {}} />
          <MenuItem icon={Bell} text="키워드 알림 설정" onClick={() => {}} />
          <MenuItem icon={Camera} text="동네생활 글쓰기" onClick={() => {}} />
      </div>

      {/* Menu List - Others */}
      <SectionTitle title="기타" />
      <div className="mx-4 bg-[#1E1E1E] rounded-xl overflow-hidden mb-8 border border-[#2a2a2a]">
          <MenuItem icon={HelpCircle} text="고객센터" onClick={() => {}} />
          <MenuItem icon={Settings} text="앱 설정" onClick={() => {}} />
          <MenuItem 
              icon={LogOut} 
              text="로그아웃" 
              isDestructive 
              onClick={handleLogout} 
          />
      </div>

      {/* Footer Info */}
      <div className="px-6 pb-6 text-center">
          <p className="text-[10px] text-gray-600 mb-1">
              보물고물 사용자 식별값: {user.id}
          </p>
          <p className="text-[10px] text-gray-600">
              앱 버전 1.0.0 (Production)
          </p>
      </div>

      {/* Level System Guide Modal */}
      {showLevelGuide && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowLevelGuide(false)}
        >
            <div 
              className="bg-[#1E1E1E] w-full max-w-sm rounded-2xl border border-gray-700 overflow-hidden text-white shadow-2xl relative cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                             <TrendingUp className="text-treasure-gold" size={20}/>
                             레벨 시스템 안내
                        </h3>
                        <button onClick={() => setShowLevelGuide(false)} className="p-1 hover:bg-gray-800 rounded-full transition">
                            <X size={24} className="text-gray-400"/>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* XP Rules */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">경험치(XP) 획득 방법</h4>
                            <ul className="text-sm space-y-2 bg-[#252525] p-4 rounded-xl border border-gray-800">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-300">물건 등록하기</span> 
                                    <span className="text-treasure-gold font-bold">+30 XP</span>
                                </li>
                                <div className="h-px bg-gray-800 w-full my-1"></div>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-300">경매 입찰 참여</span> 
                                    <span className="text-treasure-gold font-bold">+10 XP</span>
                                </li>
                                <div className="h-px bg-gray-800 w-full my-1"></div>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-300">낙찰 및 구매 확정</span> 
                                    <span className="text-treasure-gold font-bold">+50 XP</span>
                                </li>
                            </ul>
                        </div>

                        {/* Tiers */}
                        <div>
                             <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">등급별 혜택</h4>
                             <div className="space-y-3">
                                <div className="flex gap-4 items-start bg-[#252525] p-3 rounded-xl border border-gray-800">
                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-black shrink-0 text-gray-300">LV.1</div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-0.5">보따리 상인</div>
                                        <div className="text-[11px] text-gray-400 leading-tight">가입 시 부여되는 기본 등급입니다. 자유롭게 거래에 참여해보세요.</div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-[#252525] p-3 rounded-xl border border-gray-800">
                                    <div className="w-10 h-10 rounded-lg bg-blue-900 text-blue-300 flex items-center justify-center text-xs font-black shrink-0">LV.2</div>
                                    <div>
                                        <div className="text-sm font-bold text-white mb-0.5">거상 (101 XP~)</div>
                                        <div className="text-[11px] text-gray-400 leading-tight">
                                            <span className="text-blue-400">거래 수수료 50% 할인</span>, 매월 도깨비 감투 1장 무료 지급
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-[#2C2214] p-3 rounded-xl border border-treasure-gold/30">
                                    <div className="w-10 h-10 rounded-lg bg-goblin-red text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg shadow-red-900/40">LV.3</div>
                                    <div>
                                        <div className="text-sm font-bold text-treasure-gold mb-0.5 flex items-center gap-1">도깨비 상인 (401 XP~) <Crown size={12}/></div>
                                        <div className="text-[11px] text-gray-400 leading-tight">
                                            <span className="text-treasure-gold">거래 수수료 평생 무료</span>, VIP 전용 뱃지, 분쟁 시 우선 처리 혜택
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setShowLevelGuide(false)} className="w-full mt-8 bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl text-sm transition">
                        확인했습니다
                    </button>
                </div>
            </div>
        </div>
     )}

    </div>
  );
};