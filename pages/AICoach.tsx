import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { User, ChatMessage } from '../types';
import PageHeader from '../components/PageHeader';
import { PaperAirplaneIcon, UserCircleIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const AICoach: React.FC = () => {
    const { user } = useAuth();
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const initChat = async () => {
            try {
                setIsLoading(true);
                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "당신은 'FitTrack AI 코치'라는 이름을 가진, 친절하고 격려를 잘하는 피트니스 코치입니다. 피트니스, 영양, 웰빙에 대해 안전하고 유용하며 동기를 부여하는 조언을 제공하세요. 의학적 조언이 필요한 경우 항상 전문가와 상담하라고 상기시켜주세요. 답변은 간결하고 이해하기 쉽게 한국어로 작성해주세요.",
                    },
                });
                setChatSession(chat);
                setMessages([{ role: 'model', text: `안녕하세요, ${user.name}님! 저는 FitTrack AI 코치입니다. 피트니스에 대해 무엇이든 물어보세요.` }]);
            } catch (err) {
                console.error("Chat initialization error:", err);
                setError("AI 코치와 연결하는 데 실패했습니다. API 키를 확인해주세요.");
            } finally {
                setIsLoading(false);
            }
        };
        initChat();
    }, [user]);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatSession) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chatSession.sendMessage({ message: userInput });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            console.error("Error sending message:", err);
            setError("메시지를 보내는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatText = (text: string) => {
        return text.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('* ')) {
                return <li key={index} className="ml-5 list-disc">{paragraph.substring(2)}</li>;
            }
            return <p key={index} className="mb-2 last:mb-0">{paragraph}</p>;
        });
    };

    if (!user) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="AI 피트니스 코치" subtitle="운동, 식단, 건강에 대해 무엇이든 물어보세요!" />

            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-md overflow-hidden min-h-0">
                <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 p-1 flex items-center justify-center flex-shrink-0">
                                    <UserCircleIcon className="w-full h-full text-blue-600" />
                                </div>
                            )}
                            <div className={`max-w-lg px-4 py-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {formatText(msg.text)}
                            </div>
                            {msg.role === 'user' && <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && (
                         <div className="flex items-end gap-3">
                             <div className="w-8 h-8 rounded-full bg-blue-100 p-1 flex items-center justify-center flex-shrink-0">
                                <UserCircleIcon className="w-full h-full text-blue-600" />
                            </div>
                             <div className="max-w-lg px-4 py-3 rounded-xl bg-gray-200 text-gray-800">
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                </div>
                             </div>
                         </div>
                    )}
                </div>

                {error && <div className="p-4 text-center text-red-500 bg-red-100">{error}</div>}

                <form onSubmit={handleSendMessage} className="p-4 bg-gray-100 border-t">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="AI 코치에게 메시지 보내기..."
                            className="flex-1 px-4 py-2 bg-transparent border-none focus:ring-0"
                            disabled={isLoading || !chatSession}
                        />
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="p-3 text-blue-600 disabled:text-gray-400 hover:text-blue-700 transition-colors">
                            <PaperAirplaneIcon className="w-6 h-6" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AICoach;