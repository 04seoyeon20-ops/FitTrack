import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FireIcon } from '../components/Icons';

const Login: React.FC = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Allow only single digit numbers
    if (/^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      // Move to next input
      if (index < 3 && inputsRef.current[index + 1]) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (value === '') {
      // Handle backspace or clearing
      const newPin = [...pin];
      newPin[index] = '';
      setPin(newPin);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPin = pin.join('');
    if (fullPin.length !== 4) {
        setError('PIN 4자리를 모두 입력해주세요.');
        return;
    }
    
    setIsLoggingIn(true);
    setError(null);

    const success = await login(fullPin);

    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('PIN이 올바르지 않습니다. 다시 시도해주세요.');
      setPin(['', '', '', '']);
      inputsRef.current[0]?.focus();
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <a href="#" className="flex items-center space-x-2 text-3xl font-bold text-blue-600">
            <FireIcon className="w-10 h-10"/>
            <span>FitTrack AI</span>
          </a>
          <p className="mt-2 text-gray-600 text-center">
            {user ? `${user.name}님, 환영합니다!` : '안녕하세요!'}
            <br/>
            비밀번호 4자리를 입력하세요
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                inputMode="numeric"
                autoFocus={index === 0}
                disabled={isLoggingIn}
              />
            ))}
          </div>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              disabled={isLoggingIn || pin.join('').length !== 4}
            >
              {isLoggingIn ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;