import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { store } from '../services/mockStore';
import { APP_NAME } from '../constants';
import { ShieldCheck, User as UserIcon, ShoppingBag } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  
  // Registration State
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      address: '',
      role: UserRole.BUYER,
      terms: false,
      marketing: false
  });

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(!formData.terms) {
          alert('개인정보 수집 이용에 동의해야 합니다.');
          return;
      }
      store.registerUser({
          id: 'u' + Date.now(),
          name: formData.name,
          phoneNumber: formData.phone,
          address: formData.address,
          role: formData.role,
          isSubscribed: false,
          quickCloseTickets: 0,
          agreedToTerms: formData.terms,
          agreedToMarketing: formData.marketing
      });
      
      // Force reload to root to apply user session
      window.location.href = '/';
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Simple mock login logic
      if (username === 'admin') {
        store.setCurrentUser('admin');
      } else if (username === 'u1' || username === 'cheolsu') {
        store.setCurrentUser('u1');
      } else if (username === 'u2' || username === 'younghee') {
        store.setCurrentUser('u2');
      } else {
        // Default fall back for demo
        store.setCurrentUser('u1');
      }
      
      // Force reload to root to apply user session
      window.location.href = '/';
  };

  const quickLogin = (id: string) => {
    store.setCurrentUser(id);
    // Force reload to root to apply user session
    window.location.href = '/';
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 max-w-md w-full relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            
            <div className="text-center mb-8">
               <h1 className="text-3xl font-black text-slate-900 mb-2">{APP_NAME}</h1>
               <p className="text-gray-500 font-medium">{isLogin ? '돌아오신 것을 환영합니다!' : '보물고물의 회원이 되어보세요'}</p>
            </div>
            
            {isLogin ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디</label>
                            <input 
                              type="text" 
                              placeholder="admin, u1, u2" 
                              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium" />
                        </div>
                        <div className="pt-2">
                            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-1">로그인</button>
                        </div>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 font-medium">데모 계정으로 빠른 로그인</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                       <button onClick={() => quickLogin('u1')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition gap-1">
                          <ShoppingBag size={20}/>
                          <span className="text-xs font-bold">김철수(판매)</span>
                       </button>
                       <button onClick={() => quickLogin('u2')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition gap-1">
                          <UserIcon size={20}/>
                          <span className="text-xs font-bold">이영희(구매)</span>
                       </button>
                       <button onClick={() => quickLogin('admin')} className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition gap-1">
                          <ShieldCheck size={20}/>
                          <span className="text-xs font-bold">관리자</span>
                       </button>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            계정이 없으신가요? <button type="button" onClick={() => setIsLogin(false)} className="text-slate-900 font-bold hover:underline">회원가입</button>
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 ml-1">이름</label>
                          <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 ml-1">연락처</label>
                          <input required type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                       </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">주소</label>
                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">가입 유형</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button type="button" onClick={() => setFormData({...formData, role: UserRole.BUYER})} className={`p-3 rounded-xl font-bold text-sm border-2 transition-all ${formData.role === UserRole.BUYER ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-100 bg-white text-gray-400'}`}>구매자</button>
                           <button type="button" onClick={() => setFormData({...formData, role: UserRole.SELLER})} className={`p-3 rounded-xl font-bold text-sm border-2 transition-all ${formData.role === UserRole.SELLER ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-100 bg-white text-gray-400'}`}>판매자</button>
                        </div>
                    </div>
                    
                    <div className="space-y-3 pt-2 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-center gap-3 text-sm cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} />
                            <span className="text-gray-600">[필수] 개인정보 수집 및 이용 동의</span>
                        </label>
                        <label className="flex items-center gap-3 text-sm cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={formData.marketing} onChange={e => setFormData({...formData, marketing: e.target.checked})} />
                            <span className="text-gray-600">[선택] 마케팅 정보 수신 동의</span>
                        </label>
                    </div>

                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all mt-2">가입 완료</button>
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            이미 계정이 있으신가요? <button type="button" onClick={() => setIsLogin(true)} className="text-amber-600 font-bold ml-1 hover:underline">로그인</button>
                        </p>
                    </div>
                </form>
            )}
        </div>
    </div>
  );
};