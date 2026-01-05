import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Gavel, User as UserIcon, Home, Menu, X, PlusCircle, ShieldCheck, Search, Bell, LogIn } from 'lucide-react';
import { store } from '../services/mockStore';
import { APP_NAME, MOCK_USERS } from '../constants';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(store.getCurrentUser());

  useEffect(() => {
    setUser(store.getCurrentUser());
    const unsubscribe = store.subscribe((event) => {
      if (event.type === 'USER_UPDATE') {
          setUser(event.user || null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setCurrentUser(e.target.value);
    navigate('/'); 
  };

  const isActive = (path: string) => {
      const match = location.pathname === path;
      return match ? 'text-treasure-gold scale-110' : 'text-gray-500 hover:text-gray-300';
  }

  return (
    <div className="min-h-screen bg-vintage-charcoal flex flex-col font-sans text-gray-200 pb-20 md:pb-0">
      {/* Navbar (Glassmorphism) */}
      <nav className="sticky top-0 z-50 glass-panel h-14 md:h-16 flex items-center transition-all">
        <div className="max-w-4xl w-full mx-auto px-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 bg-treasure-gold rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-xl">👹</span>
             </div>
             <span className="font-heading text-white text-xl tracking-tight group-hover:text-treasure-gold transition-colors">보물고물</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-bold text-gray-400 text-sm">
            <Link to="/auctions" className={`hover:text-treasure-gold transition ${location.pathname.includes('auction') ? 'text-treasure-gold' : ''}`}>도깨비 경매</Link>
            <Link to="/shop" className={`hover:text-treasure-gold transition ${location.pathname.includes('shop') ? 'text-treasure-gold' : ''}`}>만물상</Link>
            <Link to="/post" className="bg-goblin-red hover:bg-red-700 text-white px-5 py-2 rounded-full transition font-bold flex items-center gap-1.5 shadow-lg shadow-red-900/30 transform hover:-translate-y-0.5 active:translate-y-0">
               <PlusCircle size={16} strokeWidth={2.5} /> 판매하기
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
             {/* Dev Tool: Role Switcher */}
             <div className="hidden md:flex items-center gap-2 text-[10px] bg-[#222] px-2 py-1 rounded-full border border-gray-700">
                <span className="text-gray-500 font-bold uppercase tracking-wide">Dev Mode</span>
                <select 
                  className="bg-transparent border-none outline-none font-bold text-gray-300 cursor-pointer"
                  value={user?.id || ''}
                  onChange={handleRoleSwitch}
                >
                   <option value="" disabled className="text-black">Guest</option>
                   {MOCK_USERS.map(u => (
                     <option key={u.id} value={u.id} className="text-black">{u.name} ({u.role})</option>
                   ))}
                </select>
             </div>

             <button className="relative group">
                <Bell size={22} className="text-gray-300 group-hover:text-white transition" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-goblin-red rounded-full ring-2 ring-[#1a1a1a]"></span>
             </button>
             
             <div className="hidden md:block pl-2 border-l border-gray-700">
               {user ? (
                 <Link to="/profile">
                   <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 overflow-hidden text-white flex items-center justify-center font-heading text-sm hover:border-treasure-gold transition">
                      {user.name?.[0] || '?'}
                   </div>
                 </Link>
               ) : (
                 <Link to="/login" className="text-sm font-bold text-treasure-gold hover:text-white flex items-center gap-1">
                    <LogIn size={16}/> 로그인
                 </Link>
               )}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-0 md:px-4 py-0 md:py-8 fade-in text-gray-200">
        {children}
      </main>

      {/* Mobile Bottom Navigation (Floating Style) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
         {/* Gradient Fade */}
         <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"></div>
         
         <div className="relative bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-gray-800 px-6 pt-3 pb-safe flex justify-between items-end h-[68px]">
            <Link to="/" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/')}`}>
              <Home size={26} strokeWidth={isActive('/') ? 2.5 : 2} />
              <span className="text-[9px] font-bold">홈</span>
            </Link>
            
            <Link to="/auctions" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/auctions')}`}>
              <Gavel size={26} strokeWidth={isActive('/auctions') ? 2.5 : 2} />
              <span className="text-[9px] font-bold">경매</span>
            </Link>
            
            <Link to="/post" className="flex flex-col items-center gap-1 -mt-8 group">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-goblin-red to-red-800 text-white flex items-center justify-center shadow-lg shadow-red-900/50 border-[3px] border-[#1a1a1a] transform group-active:scale-95 transition-all">
                  <PlusCircle size={28} />
              </div>
              <span className={`text-[9px] font-bold ${location.pathname === '/post' ? 'text-white' : 'text-gray-500'}`}>판매</span>
            </Link>

            <Link to="/shop" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/shop')}`}>
              <ShoppingBag size={26} strokeWidth={isActive('/shop') ? 2.5 : 2} />
              <span className="text-[9px] font-bold">상점</span>
            </Link>
            
            <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/profile')}`}>
              <UserIcon size={26} strokeWidth={isActive('/profile') ? 2.5 : 2} />
              <span className="text-[9px] font-bold">내정보</span>
            </Link>
         </div>
      </div>

      {/* Footer */}
      <footer className="hidden md:block bg-[#161616] border-t border-gray-800 pt-12 pb-12 mt-16 text-gray-500">
        <div className="max-w-4xl mx-auto px-4 text-xs">
           <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">👹</span>
              <span className="font-heading text-lg text-gray-300">보물고물</span>
           </div>
           <div className="flex gap-6 mb-6 font-bold text-gray-400">
             <a href="#" className="hover:text-treasure-gold">서비스 이용약관</a>
             <a href="#" className="hover:text-treasure-gold">개인정보처리방침</a>
             <a href="#" className="hover:text-treasure-gold">운영정책</a>
             <a href="#" className="hover:text-treasure-gold">고객센터</a>
           </div>
           <p className="leading-relaxed opacity-60">
             (주)보물고물 | 대표: 김도깨비 | 사업자등록번호: 123-45-67890<br/>
             주소: 서울특별시 종로구 인사동길 12, 지하 1층 보물창고<br/>
             Copyright © BomulGomul. All rights reserved.
           </p>
        </div>
      </footer>
    </div>
  );
};