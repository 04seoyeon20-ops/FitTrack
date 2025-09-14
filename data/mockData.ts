import { User, Workout } from '../types';

export const mockUser: User = {
    name: '알렉스',
    age: 28,
    weight: 75,
    height: 180,
    avatarUrl: 'https://picsum.photos/id/237/200/200',
    workoutStreak: 12,
    muscleMass: 35.5,
    weightHistory: [
        { date: '10-20', weight: 76.5 },
        { date: '10-21', weight: 76.2 },
        { date: '10-22', weight: 76.0 },
        { date: '10-23', weight: 75.8 },
        { date: '10-24', weight: 75.5 },
        { date: '10-25', weight: 75.3 },
        { date: '10-26', weight: 75.1 },
        { date: '10-27', weight: 75.0 },
    ],
    muscleMassHistory: [
        { date: '10-20', mass: 34.8 },
        { date: '10-21', mass: 34.9 },
        { date: '10-22', mass: 35.0 },
        { date: '10-23', mass: 35.1 },
        { date: '10-24', mass: 35.2 },
        { date: '10-25', mass: 35.4 },
        { date: '10-26', mass: 35.5 },
        { date: '10-27', mass: 35.5 },
    ],
    recentWorkouts: {
        today: [
            { exercise: '아침 달리기', duration: 30 },
            { exercise: '스트레칭', duration: 15 },
        ],
        yesterday: [
            { exercise: '벤치프레스', duration: 45 },
            { exercise: '스쿼트', duration: 60 },
        ],
    },
};

export const mockWorkouts: Workout[] = [
    {
        id: 'w1',
        date: '2023-10-26',
        name: '가슴/삼두 운동',
        exercises: [
            { id: 'e1', name: '벤치프레스', sets: [{ id: 's1', weight: 60, reps: 12 }, { id: 's2', weight: 65, reps: 10 }, {id: 's2a', weight: 70, reps: 8}] },
            { id: 'e2', name: '딥스', sets: [{ id: 's3', weight: 0, reps: 15 }, { id: 's4', weight: 0, reps: 12 }] },
        ],
    },
    {
        id: 'w2',
        date: '2023-10-24',
        name: '등/이두 운동',
        exercises: [
            { id: 'e3', name: '데드리프트', sets: [{ id: 's5', weight: 100, reps: 5 }, { id: 's5a', weight: 110, reps: 3 }] },
            { id: 'e4', name: '풀업', sets: [{ id: 's6', weight: 0, reps: 8 }, { id: 's7', weight: 0, reps: 7 }] },
            { id: 'e5', name: '바벨 컬', sets: [{ id: 's8', weight: 20, reps: 10 }] },
        ],
    },
    {
        id: 'w3',
        date: '2023-10-22',
        name: '하체 운동',
        exercises: [
            { id: 'e6', name: '스쿼트', sets: [{ id: 's9', weight: 80, reps: 10 }, { id: 's10', weight: 85, reps: 8 }, { id: 's11', weight: 85, reps: 8 }] },
            { id: 'e7', name: '레그 프레스', sets: [{ id: 's12', weight: 150, reps: 12 }, { id: 's13', weight: 160, reps: 10 }] },
        ],
    },
    {
        id: 'w4',
        date: '2023-10-19',
        name: '가슴/삼두 운동',
        exercises: [
            { id: 'e8', name: '벤치프레스', sets: [{ id: 's14', weight: 60, reps: 10 }, { id: 's15', weight: 65, reps: 8 }] },
            { id: 'e9', name: '케이블 크로스오버', sets: [{ id: 's16', weight: 15, reps: 15 }, { id: 's17', weight: 15, reps: 12 }] },
        ],
    },
    {
        id: 'w5',
        date: '2023-10-17',
        name: '등/이두 운동',
        exercises: [
            { id: 'e10', name: '데드리프트', sets: [{ id: 's18', weight: 90, reps: 5 }, { id: 's19', weight: 100, reps: 5 }] },
            { id: 'e11', name: '랫 풀 다운', sets: [{ id: 's20', weight: 50, reps: 12 }, { id: 's21', weight: 55, reps: 10 }] },
        ],
    },
    {
        id: 'w6',
        date: '2023-10-15',
        name: '하체 운동',
        exercises: [
            { id: 'e12', name: '스쿼트', sets: [{ id: 's22', weight: 70, reps: 10 }, { id: 's23', weight: 80, reps: 8 }, { id: 's24', weight: 80, reps: 8 }] },
            { id: 'e13', name: '런지', sets: [{ id: 's25', weight: 10, reps: 12 }, { id: 's26', weight: 10, reps: 12 }] },
        ],
    },
    {
        id: 'w7',
        date: '2023-10-12',
        name: '가슴 운동',
        exercises: [
            { id: 'e14', name: '벤치프레스', sets: [{ id: 's27', weight: 55, reps: 12 }, { id: 's28', weight: 60, reps: 10 }] },
        ],
    },
    {
        id: 'w8',
        date: '2023-10-05',
        name: '전신 운동',
        exercises: [
            { id: 'e15', name: '스쿼트', sets: [{ id: 's29', weight: 60, reps: 12 }, { id: 's30', weight: 70, reps: 10 }] },
            { id: 'e16', name: '벤치프레스', sets: [{ id: 's31', weight: 50, reps: 10 }] },
            { id: 'e17', name: '데드리프트', sets: [{ id: 's32', weight: 80, reps: 8 }] },
        ],
    },
     {
        id: 'w9',
        date: '2023-09-28',
        name: '전신 운동',
        exercises: [
            { id: 'e18', name: '스쿼트', sets: [{ id: 's33', weight: 60, reps: 10 }] },
            { id: 'e19', name: '벤치프레스', sets: [{ id: 's34', weight: 50, reps: 8 }] },
            { id: 'e20', name: '데드리프트', sets: [{ id: 's35', weight: 70, reps: 8 }] },
        ],
    },
     {
        id: 'w10',
        date: '2023-09-21',
        name: '상체 운동',
        exercises: [
            { id: 'e21', name: '벤치프레스', sets: [{ id: 's36', weight: 45, reps: 10 }] },
            { id: 'e22', name: '풀업', sets: [{ id: 's37', weight: 0, reps: 5 }] },
        ],
    },
];
