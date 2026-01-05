import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Gavel, User as UserIcon, Home, Menu, X, PlusCircle, ShieldCheck, Search, Bell } from 'lucide-react';
import { store } from '../services/mockStore';
import { APP_NAME, MOCK_USERS } from '../constants';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(store.getCurrentUser());

  // Subscribe to store updates to keep user state in sync
  useEffect(() => {
    setUser(store.getCurrentUser());
    const interval = setInterval(() => {
      const currentUser = store.getCurrentUser();
      setUser(prev => {
        if (prev?.id !== currentUser?.id) {
            return currentUser ? { ...currentUser } : null;
        }
        if (prev && currentUser && (prev.quickCloseTickets !== currentUser.quickCloseTickets || prev.isSubscribed !== currentUser.isSubscribed)) {
             return { ...currentUser };
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setCurrentUser(e.target.value);
    window.location.reload(); 
  };

  const isActive = (path: string) => location.pathname === path 
    ? 'text-amber-500 font-bold' 
    : 'text-slate-400 hover:text-slate-600';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900 pb-20 md:pb-0">
      {/* Navbar (Desktop & Mobile Header) */}
      <nav className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 h-14 md:h-16 flex items-center shadow-md">
        <div className="max-w-4xl w-full mx-auto px-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-1">
            <Link to="/" className="font-bold text-lg md:text-xl flex items-center gap-2">
               <span className="text-amber-400 font-black tracking-tighter text-xl md:text-2xl">보물고물</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-300 text-sm">
            <Link to="/auctions" className="hover:text-amber-400 transition">경매 바로가기</Link>
            <Link to="/shop" className="hover:text-amber-400 transition">쇼핑몰</Link>
          </div>

          {/* Right Icons (Search, Notif, Menu) */}
          <div className="flex items-center gap-3 md:gap-5">
             <div className="hidden md:flex items-center gap-2 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">Demo</span>
                <select 
                  className="bg-transparent border-none outline-none font-bold text-slate-200 cursor-pointer text-xs"
                  value={user?.id || ''}
                  onChange={handleRoleSwitch}
                >
                   <option value="" disabled className="text-black">User</option>
                   {MOCK_USERS.map(u => (
                     <option key={u.id} value={u.id} className="text-black">{u.name}</option>
                   ))}
                </select>
             </div>

             <button><Bell size={22} className="text-slate-300 hover:text-white" /></button>
             
             {/* Desktop Profile */}
             <div className="hidden md:block">
               {user ? (
                 <Link to="/profile">
                   <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-700 overflow-hidden text-slate-900 flex items-center justify-center font-bold text-xs">
                      {user.name[0]}
                   </div>
                 </Link>
               ) : (
                 <Link to="/login" className="text-sm font-bold text-amber-400 hover:text-amber-300">로그인</Link>
               )}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-0 md:px-4 py-0 md:py-8 fade-in">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] md:hidden z-50 flex justify-around items-center pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
           <Home size={24} strokeWidth={isActive('/').includes('amber') ? 2.5 : 2} />
           <span className="text-[10px]">홈</span>
        </Link>
        <Link to="/auctions" className={`flex flex-col items-center gap-1 ${isActive('/auctions')}`}>
           <Gavel size={24} strokeWidth={isActive('/auctions').includes('amber') ? 2.5 : 2}/>
           <span className="text-[10px]">경매</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center gap-1 ${isActive('/shop')}`}>
           <ShoppingBag size={24} strokeWidth={isActive('/shop').includes('amber') ? 2.5 : 2}/>
           <span className="text-[10px]">쇼핑몰</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
           <UserIcon size={24} strokeWidth={isActive('/profile').includes('amber') ? 2.5 : 2}/>
           <span className="text-[10px]">마이</span>
        </Link>
      </div>

      {/* Footer (Desktop Only) */}
      <footer className="hidden md:block bg-slate-900 border-t border-slate-800 pt-10 pb-10 mt-10">
        <div className="max-w-4xl mx-auto px-4 text-xs text-slate-400">
           <div className="flex gap-4 mb-4 font-bold text-slate-300">
             <span>이용약관</span>
             <span>개인정보처리방침</span>
             <span>운영정책</span>
           </div>
           <p className="leading-relaxed">
             (주)보물고물 | 대표: 홍길동 | 사업자번호: 123-45-67890<br/>
             주소: 서울특별시 강남구 테헤란로 123
           </p>
        </div>
      </footer>
    </div>
  );
};