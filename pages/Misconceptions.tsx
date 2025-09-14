import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { CheckCircleIcon, XCircleIcon, ClipboardListIcon } from '../components/Icons';

const quizzes = [
    {
        statement: "여성이 무거운 중량 운동을 하면 몸이 우락부락해진다.",
        correctAnswer: 'X',
        explanation: "많은 여성이 걱정하지만, 현실적으로 여성은 남성처럼 크고 우람한 근육을 만들 수 있는 테스토스테론 수치를 가지고 있지 않습니다. 대신 근력 운동은 여성이 순수 근육을 만드는 데 도움을 주며, 이는 신진대사를 높이고 골밀도를 개선하며 탄탄하고 운동적인 몸매를 만듭니다. '우락부락한' 몸매를 만들기 위해서는 매우 특정한 고강도 훈련과 칼로리 과잉 섭취가 필요한데, 이는 우연히 일어나지 않습니다.",
        takeaway: "무게를 두려워하지 마세요! 근력 운동은 여성 건강에 매우 중요하며, 당신을 우락부락하게 만들기보다는 강하고 탄탄하게 보이도록 도와줄 것입니다."
    },
    {
        statement: "특정 부위의 지방만 뺄 수 있다.",
        correctAnswer: 'X',
        explanation: "안타깝게도, 우리 몸이 어느 부위의 지방을 먼저 뺄지 선택할 수는 없습니다. 끝없는 크런치 운동은 복근을 강화할 수는 있지만, 그 위에 덮인 지방을 특정적으로 태우지는 못합니다. 지방 감량은 식단과 운동을 통해 지속적인 칼로리 결손 상태일 때 몸 전체적으로 일어납니다. 어느 부위의 지방이 먼저 빠질지는 대체로 유전적으로 결정됩니다.",
        takeaway: "전체적인 지방 감량을 위해 전신 운동 루틴과 건강한 식단에 집중하세요. 특정 부위 감량은 시간이 지나면서 자연스럽게 이루어질 것입니다."
    },
    {
        statement: "고통 없이는 얻는 것도 없다 (No Pain, No Gain).",
        correctAnswer: 'X',
        explanation: "힘든 운동 후 약간의 근육통(지연성 근육통 또는 DOMS)은 정상이지만, 날카롭고 찌르는 듯하거나 지속적인 통증은 정상이 아닙니다. 통증은 무언가 잘못되었다는 몸의 신호입니다. 실제 통증을 참고 운동을 계속하면 심각한 부상으로 이어져 운동 진행을 크게 후퇴시킬 수 있습니다.",
        takeaway: "몸의 소리에 귀를 기울이세요. 근육 피로와 통증을 구별하세요. 휴식과 회복은 운동 자체만큼이나 중요합니다."
    },
     {
        statement: "체중 감량을 위한 유일한 방법은 유산소 운동이다.",
        correctAnswer: 'X',
        explanation: "유산소 운동은 칼로리를 태우고 심장 건강을 개선하는 데 훌륭하지만, 이것이 퍼즐의 유일한 조각은 아닙니다. 장기적인 체중 관리를 위해서는 근력 운동이 똑같이, 혹은 더 중요할 수 있습니다. 근육을 만들면 휴식 대사율이 증가하여 운동하지 않을 때에도 더 많은 칼로리를 소모하게 됩니다. 유산소와 근력 운동의 조합이 가장 효과적인 접근 방식입니다.",
        takeaway: "최적의 체중 감량과 신체 구성을 위해, 주 2-3회의 근력 운동과 함께 규칙적인 유산소 운동을 병행하세요."
    },
    {
        statement: "땀을 많이 흘릴수록 더 많은 지방을 태우는 것이다.",
        correctAnswer: 'X',
        explanation: "땀은 지방이 타는 지표가 아니라, 몸의 체온 조절 메커니즘입니다. 땀의 양은 운동 강도, 온도, 습도, 유전 등 다양한 요인에 따라 달라집니다. 땀으로 인한 체중 감소는 대부분 수분 손실이며, 물을 마시면 다시 회복됩니다. 지방 연소는 칼로리 소모와 직접적으로 관련이 있습니다.",
        takeaway: "땀의 양에 집착하지 말고, 운동의 질과 꾸준함에 집중하세요. 운동 중 수분 보충은 필수입니다."
    },
];

type StoredAnswers = Record<number, 'O' | 'X'>;

const Misconceptions: React.FC = () => {
    const [viewMode, setViewMode] = useState<'quiz' | 'archive'>('quiz');
    const [answers, setAnswers] = useState<StoredAnswers>({});

    useEffect(() => {
        try {
            const savedAnswers = localStorage.getItem('quizAnswers');
            if (savedAnswers) {
                setAnswers(JSON.parse(savedAnswers));
            }
        } catch (error) {
            console.error("localStorage에서 퀴즈 답변을 파싱하는 데 실패했습니다:", error);
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
    }, [answers]);

    const dailyQuizIndex = useMemo(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return dayOfYear % quizzes.length;
    }, []);

    const dailyQuiz = quizzes[dailyQuizIndex];
    const userAnswerForToday = answers[dailyQuizIndex];
    const isTodayQuizAnswered = userAnswerForToday != null;

    const handleAnswer = (choice: 'O' | 'X') => {
        setAnswers(prev => ({ ...prev, [dailyQuizIndex]: choice }));
    };

    const answeredQuizIndices = Object.keys(answers).map(Number).sort((a, b) => b - a);

    return (
        <div>
            <PageHeader title="오늘의 퀴즈" subtitle="O/X 퀴즈를 통해 올바른 운동 지식을 확인해보세요." />

            <div className="flex justify-end mb-6">
                {viewMode === 'quiz' ? (
                    <button 
                        onClick={() => setViewMode('archive')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ClipboardListIcon className="w-5 h-5" />
                        지난 퀴즈 다시보기
                    </button>
                ) : (
                     <button 
                        onClick={() => setViewMode('quiz')}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        오늘의 퀴즈로 돌아가기
                    </button>
                )}
            </div>

            {viewMode === 'quiz' ? (
                 <div className="max-w-3xl mx-auto">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-4">오늘의 퀴즈</h2>
                    <div className={`bg-white p-6 rounded-xl shadow-md border-2 transition-all ${isTodayQuizAnswered ? (userAnswerForToday === dailyQuiz.correctAnswer ? 'border-green-500' : 'border-red-500') : 'border-gray-200'}`}>
                        <div className="flex items-start gap-4">
                            <div className="text-2xl font-bold text-blue-600">Q.</div>
                            <p className="flex-1 text-lg font-semibold text-gray-800">{dailyQuiz.statement}</p>
                        </div>
                        
                        {!isTodayQuizAnswered ? (
                            <div className="mt-6 flex justify-end gap-4">
                                <button onClick={() => handleAnswer('O')} className="w-20 h-20 rounded-full border-4 border-blue-400 text-blue-500 text-3xl font-bold flex items-center justify-center hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-label="맞다">O</button>
                                <button onClick={() => handleAnswer('X')} className="w-20 h-20 rounded-full border-4 border-red-400 text-red-500 text-3xl font-bold flex items-center justify-center hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" aria-label="틀리다">X</button>
                            </div>
                        ) : (
                            <div className="mt-4 p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-2">
                                    {userAnswerForToday === dailyQuiz.correctAnswer ? <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" /> : <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />}
                                    <p className={`text-lg font-bold ${userAnswerForToday === dailyQuiz.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                                        {userAnswerForToday === dailyQuiz.correctAnswer ? '정답입니다!' : '오답입니다.'} (정답: {dailyQuiz.correctAnswer})
                                    </p>
                                </div>
                                <p className="mt-3 text-gray-700">{dailyQuiz.explanation}</p>
                                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                                    <p className="font-semibold text-blue-800">핵심 요약:</p>
                                    <p className="text-blue-700">{dailyQuiz.takeaway}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">복습 노트</h2>
                    {answeredQuizIndices.length > 0 ? (
                        <div className="space-y-4">
                            {answeredQuizIndices.map(index => {
                                const quiz = quizzes[index];
                                const userAnswer = answers[index];
                                const isCorrect = userAnswer === quiz.correctAnswer;
                                return (
                                    <div key={index} className="bg-white p-5 rounded-lg shadow-sm border">
                                        <p className="font-semibold text-gray-700 mb-2">Q. {quiz.statement}</p>
                                        <div className="text-sm mb-3">
                                            <span className="font-medium">내 답변: {userAnswer}</span>
                                            {isCorrect ? <span className="ml-2 text-green-600 font-bold">(정답)</span> : <span className="ml-2 text-red-600 font-bold">(오답 - 정답: {quiz.correctAnswer})</span>}
                                        </div>
                                        <details className="group">
                                            <summary className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline">해설 보기</summary>
                                            <div className="mt-2 pt-3 border-t text-sm text-gray-600">
                                                <p>{quiz.explanation}</p>
                                                <div className="mt-3 bg-gray-100 border-l-4 border-gray-400 p-2 rounded">
                                                    <p className="font-semibold text-gray-800">핵심:</p>
                                                    <p className="text-gray-700">{quiz.takeaway}</p>
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                            <ClipboardListIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">아직 푼 퀴즈가 없습니다.</h3>
                            <p className="mt-1 text-sm text-gray-500">'오늘의 퀴즈'를 풀어보세요!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Misconceptions;