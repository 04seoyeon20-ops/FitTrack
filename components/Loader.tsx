import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = "로딩 중..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
};

export default Loader;