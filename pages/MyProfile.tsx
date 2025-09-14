import React, { useState, useEffect } from 'react';
import { User } from '../types';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const MyProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      const { name, value } = e.target;
      setEditedUser({ ...editedUser, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedUser) {
        await updateUser(editedUser);
        setIsEditing(false);
    }
  };

  if (!editedUser) {
    return <div className="flex justify-center items-center h-full"><Loader /></div>;
  }

  return (
    <div>
      <PageHeader title="내 프로필" subtitle="개인 정보 및 설정을 관리하세요." />
      
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <img src={editedUser.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full mb-4 ring-4 ring-blue-200" />
          <h2 className="text-2xl font-bold text-gray-800">{editedUser.name}</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              value={editedUser.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">나이</label>
              <input 
                type="number" 
                name="age" 
                id="age"
                value={editedUser.age}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">체중 (kg)</label>
              <input 
                type="number" 
                name="weight" 
                id="weight"
                step="0.1"
                value={editedUser.weight}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">신장 (cm)</label>
              <input 
                type="number" 
                name="height" 
                id="height"
                step="0.1"
                value={editedUser.height}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button type="button" onClick={() => { setIsEditing(false); setEditedUser(user); }} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  취소
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  변경 내용 저장
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                프로필 수정
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;