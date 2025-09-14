
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { calculateCalories, getLowCalorieRecipe } from '../services/geminiService';
import { CalorieCalculationResult, LowCalorieRecipe } from '../types';
import Loader from '../components/Loader';
import { CalculatorIcon, RefreshIcon, ChefHatIcon } from '../components/Icons';

const DietInfo: React.FC = () => {
    // Calorie Calculator State
    const [foodInput, setFoodInput] = useState('');
    const [calorieResult, setCalorieResult] = useState<CalorieCalculationResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [calorieError, setCalorieError] = useState<string | null>(null);

    // Recipe Recommender State
    const [recipe, setRecipe] = useState<LowCalorieRecipe | null>(null);
    const [isFetchingRecipe, setIsFetchingRecipe] = useState(false);
    const [recipeError, setRecipeError] = useState<string | null>(null);

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!foodInput.trim()) return;
        setIsCalculating(true);
        setCalorieError(null);
        setCalorieResult(null);
        try {
            const result = await calculateCalories(foodInput);
            setCalorieResult(result);
        } catch (err: any) {
            setCalorieError(err.message);
        } finally {
            setIsCalculating(false);
        }
    };
    
    const handleFetchRecipe = async () => {
        setIsFetchingRecipe(true);
        setRecipeError(null);
        setRecipe(null);
        try {
            const result = await getLowCalorieRecipe();
            setRecipe(result);
        } catch (err: any) {
            setRecipeError(err.message);
        } finally {
            setIsFetchingRecipe(false);
        }
    };


    return (
        <div>
            <PageHeader title="AI 식단 관리" subtitle="칼로리를 계산하고, 건강한 레시피를 추천받아보세요." />
            
            {/* Calorie Calculator Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex items-center mb-4">
                    <CalculatorIcon className="w-8 h-8 text-blue-600 mr-3"/>
                    <h2 className="text-2xl font-bold text-gray-800">오늘의 칼로리 계산기</h2>
                </div>
                <p className="text-gray-600 mb-4">오늘 드신 음식을 입력해보세요. AI가 칼로리를 분석해드립니다. (예: 사과 1개, 닭가슴살 200g, 밥 한 공기)</p>
                <form onSubmit={handleCalculate}>
                    <textarea
                        value={foodInput}
                        onChange={(e) => setFoodInput(e.target.value)}
                        placeholder="여기에 음식을 입력하세요..."
                        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isCalculating}
                    />
                    <button
                        type="submit"
                        disabled={isCalculating || !foodInput.trim()}
                        className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {isCalculating ? '계산 중...' : '계산하기'}
                    </button>
                </form>

                {isCalculating && <Loader message="AI가 칼로리를 분석하고 있습니다..." />}
                {calorieError && <div className="mt-4 text-red-500 bg-red-100 p-3 rounded-lg text-center">{calorieError}</div>}
                {calorieResult && (
                    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        <h3 className="text-lg font-bold text-green-800">분석 결과</h3>
                        <p className="text-2xl font-bold text-green-700 my-2">총 섭취 칼로리: {calorieResult.totalCalories.toLocaleString()} kcal</p>
                        <ul className="space-y-1">
                            {calorieResult.foods.map((item, index) => (
                                <li key={index} className="flex justify-between text-gray-700">
                                    <span>{item.food}</span>
                                    <span className="font-semibold">{item.calories.toLocaleString()} kcal</span>
                                </li>
                            ))}
                        </ul>
                         <p className="text-xs text-gray-500 mt-3">* AI가 계산한 추정치이며 실제와 다를 수 있습니다.</p>
                    </div>
                )}
            </div>

            {/* Recipe Recommender Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex items-center mb-4">
                    <ChefHatIcon className="w-8 h-8 text-orange-500 mr-3"/>
                    <h2 className="text-2xl font-bold text-gray-800">AI 저칼로리 레시피 추천</h2>
                </div>
                <button
                    onClick={handleFetchRecipe}
                    disabled={isFetchingRecipe}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                >
                    <RefreshIcon className={`w-5 h-5 ${isFetchingRecipe ? 'animate-spin' : ''}`}/>
                    {isFetchingRecipe ? '레시피 생성 중...' : '새로운 레시피 추천받기'}
                </button>
                
                {isFetchingRecipe && <Loader message="맛있고 건강한 레시피를 찾고 있습니다..." />}
                {recipeError && <div className="mt-4 text-red-500 bg-red-100 p-3 rounded-lg text-center">{recipeError}</div>}
                
                {recipe ? (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gray-50 p-4 rounded-lg">
                        <img 
                          src={`https://source.unsplash.com/500x500/?${encodeURIComponent(recipe.imageSearchQuery)}`} 
                          alt={recipe.recipeName}
                          className="w-full h-64 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{recipe.recipeName}</h3>
                            <p className="text-gray-600 mt-2 mb-4">{recipe.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700">재료:</h4>
                                <ul className="list-disc list-inside text-gray-600 text-sm">
                                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700">조리법:</h4>
                                <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1">
                                    {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            </div>
                        </div>
                    </div>
                ) : (
                    !isFetchingRecipe && !recipeError && (
                        <div className="text-center py-10 text-gray-500">
                            버튼을 눌러 건강한 레시피 아이디어를 얻어보세요!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default DietInfo;