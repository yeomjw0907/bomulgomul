import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Landmark, Shield } from 'lucide-react';
import { PaymentMethod } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => Promise<void>;
  amount: number;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, amount }) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.SIMPLE_PAY);

  if (!isOpen) return null;

  const handlePay = async () => {
    setStep('PROCESSING');
    await onConfirm(method);
    setStep('SUCCESS');
    setTimeout(() => {
      onClose();
      setStep('SELECT'); 
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#1E1E1E] rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full overflow-hidden transform transition-all scale-100 text-gray-200 relative">
        
        {/* Decorative Top */}
        <div className="h-1.5 bg-gradient-to-r from-goblin-red via-red-700 to-goblin-red"></div>

        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-gray-800">
          <h3 className="font-heading text-xl text-white flex items-center gap-2">
             <Shield size={20} className="text-treasure-gold"/> 안전 결제
          </h3>
          {step === 'SELECT' && <button onClick={onClose} className="p-2 hover:bg-[#333] rounded-full transition text-gray-400 hover:text-white"><X size={20}/></button>}
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'SELECT' && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">Total Amount</p>
                <p className="text-4xl font-black text-white tracking-tight">{amount.toLocaleString()}<span className="text-xl text-treasure-gold ml-1 font-bold">KRW</span></p>
              </div>

              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setMethod(PaymentMethod.SIMPLE_PAY)}
                  className={`w-full flex items-center p-4 border rounded-xl transition-all group ${method === PaymentMethod.SIMPLE_PAY ? 'border-goblin-red bg-red-900/10' : 'border-gray-700 hover:border-gray-500 bg-[#252525]'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${method === PaymentMethod.SIMPLE_PAY ? 'bg-goblin-red text-white' : 'bg-[#333] text-gray-500 group-hover:text-gray-300'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${method === PaymentMethod.SIMPLE_PAY ? 'text-white' : 'text-gray-300'}`}>간편 결제</p>
                    <p className="text-[10px] text-gray-500 font-medium">카카오페이 / 네이버페이 / 카드</p>
                  </div>
                </button>

                <button
                  onClick={() => setMethod(PaymentMethod.BANK_TRANSFER)}
                  className={`w-full flex items-center p-4 border rounded-xl transition-all group ${method === PaymentMethod.BANK_TRANSFER ? 'border-goblin-red bg-red-900/10' : 'border-gray-700 hover:border-gray-500 bg-[#252525]'}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${method === PaymentMethod.BANK_TRANSFER ? 'bg-goblin-red text-white' : 'bg-[#333] text-gray-500 group-hover:text-gray-300'}`}>
                    <Landmark size={20} />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${method === PaymentMethod.BANK_TRANSFER ? 'text-white' : 'text-gray-300'}`}>무통장 입금</p>
                    <p className="text-[10px] text-gray-500 font-medium">가상계좌 발급 (24시간 유효)</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={handlePay}
                className="w-full bg-treasure-gold hover:bg-yellow-500 text-black font-black py-4 rounded-xl transition shadow-lg shadow-yellow-900/20 transform hover:-translate-y-0.5"
              >
                결제 진행하기
              </button>
            </>
          )}

          {step === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-goblin-red border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white font-bold text-lg">결제 처리 중입니다...</p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-500 ring-4 ring-green-900/20">
                 <CheckCircle size={40} />
              </div>
              <p className="text-2xl font-black text-white mb-2">결제 성공!</p>
              <p className="text-gray-400 font-medium text-sm">보물이 곧 배송됩니다.</p>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="bg-[#1a1a1a] px-6 py-4 text-center border-t border-gray-800">
          <p className="text-[10px] text-gray-600 font-medium leading-relaxed">
             (주)보물고물은 에스크로(결제대금예치) 시스템을 적용하여<br/> 안전한 거래를 보장합니다.
          </p>
        </div>
      </div>
    </div>
  );
};