import React from 'react';
import { store } from '../services/mockStore';
import { UserRole } from '../types';
import { Crown, Ticket, MapPin, Phone, Settings, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const user = store.getCurrentUser();
  const navigate = useNavigate();

  if (!user) return <div className="p-10 text-center font-bold text-gray-500">로그인이 필요합니다.</div>;

  const handleSubscribe = () => {
    store.subscribeUser(user.id);
    window.location.reload();
  };

  const handleLogout = () => {
    store.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <h1 className="text-3xl font-black text-slate-900 mb-8">마이페이지</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Sidebar Profile Card */}
         <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-4xl font-black text-slate-400 mb-4 shadow-inner">
                    {user.name[0]}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wide mb-6">
                    {user.role}
                </div>
                
                <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                       <Phone size={16} className="text-gray-400"/> {user.phoneNumber}
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                       <MapPin size={16} className="text-gray-400"/> <span className="truncate">{user.address}</span>
                    </div>
                </div>

                <div className="w-full pt-6 mt-6 border-t border-gray-100 flex gap-2">
                   <button className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold transition">정보 수정</button>
                   <button onClick={handleLogout} className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 text-sm font-bold transition flex items-center justify-center gap-1">
                      <LogOut size={14} /> 로그아웃
                   </button>
                </div>
            </div>
         </div>

         {/* Main Dashboard */}
         <div className="md:col-span-2 space-y-8">
            {/* Subscription Banner */}
            <div className={`relative p-8 rounded-[2rem] overflow-hidden ${user.isSubscribed ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20' : 'bg-white border border-gray-200'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div>
                       <div className="flex items-center gap-2 mb-2">
                          <Crown className={user.isSubscribed ? 'text-amber-400' : 'text-gray-400'} size={24} fill={user.isSubscribed ? "currentColor" : "none"}/>
                          <h3 className="text-lg font-bold">멤버십 상태</h3>
                       </div>
                       <p className={`text-2xl font-black mb-2 ${user.isSubscribed ? 'text-white' : 'text-slate-900'}`}>
                          {user.isSubscribed ? 'Premium Plan' : 'Basic Plan'}
                       </p>
                       <p className={`text-sm ${user.isSubscribed ? 'text-slate-300' : 'text-gray-500'}`}>
                          {user.isSubscribed ? '매월 티켓 3장 지급 및 수수료 우대 혜택' : '프리미엄 구독하고 경매 즉시 낙찰 혜택을 받아보세요.'}
                       </p>
                   </div>
                   
                   <div className="flex flex-col items-end gap-3">
                       <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-500/30">
                           <Ticket className="text-amber-500" size={20} />
                           <span className={`font-bold ${user.isSubscribed ? 'text-white' : 'text-slate-900'}`}>보유 티켓: {user.quickCloseTickets}장</span>
                       </div>
                       {!user.isSubscribed && (
                          <button onClick={handleSubscribe} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg">
                             구독 시작하기 (₩4,900/월)
                          </button>
                       )}
                   </div>
                </div>
                
                {/* Decorative Pattern */}
                {user.isSubscribed && (
                   <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                )}
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[200px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-slate-900 text-lg">참여 중인 경매</h3>
                       <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                          <Package size={16}/>
                       </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200 m-2">
                       참여 중인 경매가 없습니다.
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow min-h-[200px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-slate-900 text-lg">구매 내역</h3>
                       <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <Package size={16}/>
                       </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-2xl border border-dashed border-gray-200 m-2">
                       최근 구매 내역이 없습니다.
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};