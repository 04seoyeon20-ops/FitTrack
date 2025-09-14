
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendedRoutine, CalorieCalculationResult, LowCalorieRecipe } from '../types';

// Fix: Initialize GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

const recommendedRoutinesSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      routineName: {
        type: Type.STRING,
        description: 'The name of the workout routine for a specific day.'
      },
      description: {
        type: Type.STRING,
        description: 'A brief description of this routine\'s focus.'
      },
      exercises: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            exerciseKey: {
                type: Type.STRING,
                description: 'A simple, machine-readable key for the exercise (e.g., "push_up", "squat").'
            },
            exerciseName: {
              type: Type.STRING,
              description: 'The name of the exercise.'
            },
            description: {
              type: Type.STRING,
              description: 'A short description of how to perform the exercise.'
            },
            sets: {
              type: Type.STRING,
              description: 'The recommended number of sets (e.g., "3").'
            },
            reps: {
              type: Type.STRING,
              description: 'The recommended number of repetitions per set (e.g., "10-12").'
            },
            rest: {
              type: Type.STRING,
              description: 'The recommended rest time between sets (e.g., "60 seconds").'
            },
            youtubeSearchQuery: {
                type: Type.STRING,
                description: 'A good search query to find a video of this exercise on YouTube.'
            }
          },
        }
      }
    },
  }
};

const calorieCalculationSchema = {
    type: Type.OBJECT,
    properties: {
        totalCalories: {
            type: Type.NUMBER,
            description: 'The total estimated calories for all food items.'
        },
        foods: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    food: {
                        type: Type.STRING,
                        description: 'The name of the identified food item.'
                    },
                    calories: {
                        type: Type.NUMBER,
                        description: 'The estimated calories for this specific food item.'
                    }
                }
            }
        }
    }
};

const lowCalorieRecipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: 'The name of the recipe.' },
        description: { type: Type.STRING, description: 'A short, enticing description of the dish.' },
        ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of ingredients.' },
        instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Step-by-step cooking instructions.' },
        imageSearchQuery: { type: Type.STRING, description: 'A simple query to find a photo of the dish (e.g., "healthy chicken salad").' },
    },
};


export async function getRecommendedRoutines(
    fitnessLevel: string, 
    goal: string, 
    daysPerWeek: number
): Promise<RecommendedRoutine[]> {
    const prompt = `
        Create a weekly workout plan based on the following user profile:
        - Fitness Level: ${fitnessLevel}
        - Main Goal: ${goal}
        - Workout Days Per Week: ${daysPerWeek}

        Generate a JSON object that is an array of workout routines. Each routine should be for one workout day.
        For example, if daysPerWeek is 3, there should be 3 items in the array.
        Each routine object should contain:
        - routineName: A descriptive name for the day's workout (e.g., 'Full Body Strength A', 'Push Day', 'Legs & Core').
        - description: A brief, motivating description of the routine's focus.
        - exercises: An array of 5-7 exercise objects.

        Each exercise object must include:
        - exerciseKey: A machine-readable key from this list: push_up, squat, plank, pull_up, lunge, bicep_curl, jumping_jack, running, deadlift, dumbbell_row, overhead_press, general_cardio, general_strength.
        - exerciseName: The name of the exercise in Korean.
        - description: A short, clear description of the exercise in Korean.
        - sets: A string representing the number of sets (e.g., "3").
        - reps: A string representing the repetitions (e.g., "10-12" or "30 seconds").
        - rest: A string for rest time in seconds (e.g., "60초").
        - youtubeSearchQuery: A simple search query in Korean for finding a video of the exercise on YouTube (e.g., "푸시업 자세").

        Provide the entire response in Korean.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recommendedRoutinesSchema,
            },
        });
        
        const jsonStr = response.text.trim();
        if (!jsonStr) {
            console.warn("Gemini returned empty text response for JSON schema.");
            return [];
        }
        const result = JSON.parse(jsonStr);
        
        if (!Array.isArray(result)) {
            throw new Error("AI response is not an array.");
        }
        
        return result as RecommendedRoutine[];

    } catch(error) {
        console.error("Error generating recommended routines:", error);
        throw new Error("AI로부터 추천 루틴을 받는 데 실패했습니다. 다시 시도해 주세요.");
    }
}


export async function calculateCalories(foodInput: string): Promise<CalorieCalculationResult> {
    const prompt = `
        Analyze the following text describing a meal and estimate the total calories.
        Break down the meal into individual food items and estimate their calories as well.
        The user input is in Korean. Provide the response in JSON format.
        Input: "${foodInput}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: calorieCalculationSchema,
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as CalorieCalculationResult;

    } catch(error) {
        console.error("Error calculating calories:", error);
        throw new Error("칼로리 계산에 실패했습니다. 입력값을 확인하고 다시 시도해 주세요.");
    }
}

export async function getLowCalorieRecipe(): Promise<LowCalorieRecipe> {
    const prompt = `
        You are a creative nutritionist. Generate a single, simple, delicious, and healthy low-calorie recipe.
        The recipe should be easy to make for someone who is busy.
        Provide the response in Korean and in JSON format.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: lowCalorieRecipeSchema,
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as LowCalorieRecipe;

    } catch(error) {
        console.error("Error generating recipe:", error);
        throw new Error("레시피를 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
}
