import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Landmark } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <h3 className="font-black text-xl text-slate-900">안전 결제</h3>
          {step === 'SELECT' && <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} className="text-gray-500"/></button>}
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'SELECT' && (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-bold mb-1">총 결제 금액</p>
                <p className="text-4xl font-black text-slate-900 tracking-tight">{amount.toLocaleString()}<span className="text-2xl text-gray-400 ml-1">원</span></p>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setMethod(PaymentMethod.SIMPLE_PAY)}
                  className={`w-full flex items-center p-5 border-2 rounded-2xl transition-all ${method === PaymentMethod.SIMPLE_PAY ? 'border-amber-500 bg-amber-50 ring-0' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4 shadow-sm">
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-lg">간편 결제</p>
                    <p className="text-xs text-gray-500 font-medium">카카오페이 / 네이버페이 / 카드</p>
                  </div>
                </button>

                <button
                  onClick={() => setMethod(PaymentMethod.BANK_TRANSFER)}
                  className={`w-full flex items-center p-5 border-2 rounded-2xl transition-all ${method === PaymentMethod.BANK_TRANSFER ? 'border-amber-500 bg-amber-50 ring-0' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 shadow-sm">
                    <Landmark size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-lg">무통장 입금</p>
                    <p className="text-xs text-gray-500 font-medium">가상계좌 발급 (입금기한 24시간)</p>
                  </div>
                </button>
              </div>

              <button 
                onClick={handlePay}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-slate-200 transform hover:-translate-y-1"
              >
                결제 진행하기
              </button>
            </>
          )}

          {step === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-slate-900 font-bold text-lg">결제 처리 중입니다...</p>
              <p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요.</p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                 <CheckCircle size={40} />
              </div>
              <p className="text-2xl font-black text-slate-900 mb-2">결제 성공!</p>
              <p className="text-gray-500 font-medium">주문이 안전하게 접수되었습니다.</p>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
             (주)보물고물은 에스크로(결제대금예치) 시스템을 적용하여<br/> 안전한 거래를 보장합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
