import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { store } from '../services/mockStore';
import { APP_NAME } from '../constants';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration State
  const [formData, setFormData] = useState({
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      address: '',
      // Defaulting to SELLER role as everyone can now buy and sell
      role: UserRole.SELLER,
      terms: false,
      marketing: false
  });

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.terms) {
          alert('개인정보 수집 이용에 동의해야 합니다.');
          return;
      }
      
      if (formData.password !== formData.confirmPassword) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
      }

      if (store.getUserById(formData.id)) {
          alert('이미 존재하는 아이디입니다.');
          return;
      }

      store.registerUser({
          id: formData.id,
          name: formData.name,
          phoneNumber: formData.phone,
          address: formData.address,
          role: formData.role,
          isSubscribed: false,
          quickCloseTickets: 0,
          ticketsPurchasedMonth: 0,
          agreedToTerms: formData.terms,
          agreedToMarketing: formData.marketing,
          xp: 0
      }, formData.password);
      
      alert('회원가입이 완료되었습니다.');
      navigate('/');
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      
      const isValid = store.validateUser(loginId, loginPassword);
      
      if (!isValid) {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      store.setCurrentUser(loginId);
      navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="bg-antique-white p-8 md:p-10 rounded-lg shadow-2xl shadow-black/50 border border-gray-700 max-w-md w-full relative overflow-hidden text-[#2C2C2C]">
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-goblin-red to-red-900"></div>
            
            <div className="text-center mb-8">
               <h1 className="text-3xl font-heading text-[#2C2C2C] mb-2">{APP_NAME}</h1>
               <p className="text-gray-500 font-medium">{isLogin ? '도깨비 터에 오신 것을 환영하오!' : '보물고물의 회원이 되어보시오'}</p>
            </div>
            
            {isLogin ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디</label>
                            <input 
                              type="text" 
                              placeholder="아이디를 입력하세요" 
                              className="w-full bg-white border border-gray-300 p-4 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red transition-all font-medium" 
                              value={loginId}
                              onChange={(e) => setLoginId(e.target.value)}
                              required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700 ml-1">비밀번호</label>
                            <input 
                                type="password" 
                                placeholder="비밀번호를 입력하세요" 
                                className="w-full bg-white border border-gray-300 p-4 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red transition-all font-medium" 
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button className="w-full bg-goblin-red hover:bg-red-800 text-white p-4 rounded-lg font-bold text-lg shadow-lg shadow-red-900/30 transition-all">로그인</button>
                        </div>
                    </form>
                    
                    {/* Helper text for demo credentials */}
                    <div className="bg-gray-100 p-4 rounded text-xs text-gray-500 leading-relaxed border border-gray-200">
                        <span className="font-bold block mb-1">📢 데모 계정 안내</span>
                        관리자: admin / admin123!<br/>
                        판매자: user1 / admin123!<br/>
                        구매자: user2 / admin123!
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            계정이 없으신가요? <button type="button" onClick={() => setIsLogin(false)} className="text-goblin-red font-bold hover:underline">회원가입</button>
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* ID / PW Section */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">아이디</label>
                        <input required type="text" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="사용할 아이디" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">비밀번호</label>
                            <input required type="password" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="admin123!" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">비밀번호 확인</label>
                            <input required type="password" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 ml-1">이름</label>
                          <input required type="text" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="홍길동" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 ml-1">연락처</label>
                          <input required type="tel" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="010-0000-0000" />
                       </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 ml-1">주소</label>
                        <input required type="text" className="w-full bg-white border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-goblin-red" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="서울특별시 강남구..." />
                    </div>

                    {/* Role selection removed - Everyone is a SELLER/BUYER now */}

                    <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="terms" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} className="w-4 h-4 accent-goblin-red"/>
                            <label htmlFor="terms" className="text-xs text-gray-500">[필수] 개인정보 수집 및 이용 동의</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="marketing" checked={formData.marketing} onChange={e => setFormData({...formData, marketing: e.target.checked})} className="w-4 h-4 accent-goblin-red"/>
                            <label htmlFor="marketing" className="text-xs text-gray-500">[선택] 마케팅 정보 수신 동의</label>
                        </div>
                    </div>
                    
                    <button className="w-full bg-goblin-red hover:bg-red-800 text-white p-4 rounded-lg font-bold text-lg shadow-xl shadow-red-900/10 transition-all mt-2">가입 완료</button>
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-500">
                            이미 계정이 있으신가요? <button type="button" onClick={() => setIsLogin(true)} className="text-goblin-red font-bold ml-1 hover:underline">로그인</button>
                        </p>
                    </div>
                </form>
            )}
        </div>
    </div>
  );
};