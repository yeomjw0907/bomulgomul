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

  useEffect(() => {
    // Initial sync
    setUser(store.getCurrentUser());
    
    // Subscribe to store updates for instant reaction to login/logout/ticket purchase
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

  const isActive = (path: string) => location.pathname === path 
    ? 'text-treasure-gold font-bold' 
    : 'text-gray-400 hover:text-gray-200';

  return (
    <div className="min-h-screen bg-vintage-charcoal flex flex-col font-sans text-antique-white pb-20 md:pb-0">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#222] border-b border-gray-800 h-14 md:h-16 flex items-center shadow-md">
        <div className="max-w-4xl w-full mx-auto px-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-1">
            <Link to="/" className="flex items-center gap-2">
               <span className="font-heading text-treasure-gold text-2xl tracking-tight">보물고물</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-300 text-sm">
            <Link to="/auctions" className="hover:text-treasure-gold transition">도깨비 경매</Link>
            <Link to="/shop" className="hover:text-treasure-gold transition">만물상</Link>
            <Link to="/post" className="bg-goblin-red hover:bg-red-800 text-white px-4 py-2 rounded-lg transition font-bold flex items-center gap-1 shadow-md shadow-red-900/20">
               <PlusCircle size={16} /> 물건 올리기
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-5">
             <div className="hidden md:flex items-center gap-2 text-xs bg-[#333] px-2 py-1 rounded border border-gray-700">
                <span className="text-gray-400">Role</span>
                <select 
                  className="bg-transparent border-none outline-none font-bold text-gray-200 cursor-pointer text-xs"
                  value={user?.id || ''}
                  onChange={handleRoleSwitch}
                >
                   <option value="" disabled className="text-black">Guest</option>
                   {MOCK_USERS.map(u => (
                     <option key={u.id} value={u.id} className="text-black">{u.name}</option>
                   ))}
                </select>
             </div>

             <button><Bell size={22} className="text-gray-300 hover:text-treasure-gold transition" /></button>
             
             <div className="hidden md:block">
               {user ? (
                 <Link to="/profile">
                   <div className="w-8 h-8 rounded-full bg-treasure-gold border-2 border-gray-600 overflow-hidden text-[#2C2C2C] flex items-center justify-center font-bold text-xs">
                      {user.name?.[0] || '?'}
                   </div>
                 </Link>
               ) : (
                 <Link to="/login" className="text-sm font-bold text-treasure-gold hover:text-yellow-200">로그인</Link>
               )}
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-0 md:px-4 py-0 md:py-8 fade-in text-[#2C2C2C]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#222] border-t border-gray-800 h-[60px] md:hidden z-50 flex justify-around items-center pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.3)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
           <Home size={24} />
           <span className="text-[10px]">홈</span>
        </Link>
        <Link to="/auctions" className={`flex flex-col items-center gap-1 ${isActive('/auctions')}`}>
           <Gavel size={24} />
           <span className="text-[10px]">경매</span>
        </Link>
        
        <Link to="/post" className="flex flex-col items-center gap-1 -mt-6">
           <div className="w-12 h-12 rounded-full bg-goblin-red text-white flex items-center justify-center shadow-lg shadow-red-900/50 border-4 border-[#222] transform hover:scale-105 transition active:scale-95">
              <PlusCircle size={24} />
           </div>
           <span className={`text-[10px] font-bold ${location.pathname === '/post' ? 'text-treasure-gold' : 'text-gray-500'}`}>판매</span>
        </Link>

        <Link to="/shop" className={`flex flex-col items-center gap-1 ${isActive('/shop')}`}>
           <ShoppingBag size={24} />
           <span className="text-[10px]">만물상</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
           <UserIcon size={24} />
           <span className="text-[10px]">내정보</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="hidden md:block bg-[#222] border-t border-gray-800 pt-10 pb-10 mt-10 text-antique-white">
        <div className="max-w-4xl mx-auto px-4 text-xs text-gray-500">
           <div className="flex gap-4 mb-4 font-bold text-gray-400">
             <span>이용약관</span>
             <span>개인정보처리방침</span>
             <span>운영정책</span>
           </div>
           <p className="leading-relaxed">
             (주)보물고물 | 도깨비 경매장<br/>
             전설의 보물을 찾아드립니다.
           </p>
        </div>
      </footer>
    </div>
  );
};