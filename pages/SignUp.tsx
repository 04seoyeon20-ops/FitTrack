import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FireIcon } from '../components/Icons';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
    });
    const [pin, setPin] = useState<string[]>(['', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();
    const pinInputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePinChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
            if (index < 3 && pinInputsRef.current[index + 1]) {
                pinInputsRef.current[index + 1]?.focus();
            }
        } else if (value === '') {
            const newPin = [...pin];
            newPin[index] = '';
            setPin(newPin);
        }
    };
  
    const handlePinKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
            pinInputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const fullPin = pin.join('');

        // Validation
        for (const key in formData) {
            if (formData[key as keyof typeof formData] === '') {
                setError('모든 필드를 입력해주세요.');
                return;
            }
        }
        if (fullPin.length !== 4) {
            setError('PIN 4자리를 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            await signup({
                name: formData.name,
                age: Number(formData.age),
                weight: Number(formData.weight),
                height: Number(formData.height),
                pin: fullPin,
            });
            navigate('/', { replace: true });
        } catch (err) {
            console.error("Signup failed:", err);
            setError('회원가입에 실패했습니다. 다시 시도해주세요.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="flex flex-col items-center">
                    <a href="#" className="flex items-center space-x-2 text-3xl font-bold text-blue-600">
                        <FireIcon className="w-10 h-10"/>
                        <span>FitTrack AI</span>
                    </a>
                    <h2 className="mt-4 text-2xl font-bold text-center text-gray-900">프로필 생성</h2>
                    <p className="mt-2 text-sm text-center text-gray-600">AI 피트니스 여정을 시작해보세요!</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="sr-only">이름</label>
                            <input id="name" name="name" type="text" required value={formData.name} onChange={handleFormChange} className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="이름" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input name="age" type="number" required value={formData.age} onChange={handleFormChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm" placeholder="나이" />
                            <input name="weight" type="number" step="0.1" required value={formData.weight} onChange={handleFormChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm" placeholder="체중(kg)" />
                            <input name="height" type="number" step="0.1" required value={formData.height} onChange={handleFormChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm" placeholder="신장(cm)" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-center text-gray-700">간편 비밀번호 (PIN 4자리)</label>
                        <div className="flex justify-center gap-3 mt-2">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { pinInputsRef.current[index] = el; }}
                                    type="password"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handlePinChange(e, index)}
                                    onKeyDown={(e) => handlePinKeyDown(e, index)}
                                    className="w-14 h-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    inputMode="numeric"
                                    disabled={isSubmitting}
                                />
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    
                    <div>
                        <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                            {isSubmitting ? '계정 생성 중...' : '계정 생성 및 시작하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;