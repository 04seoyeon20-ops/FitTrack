import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import Loader from '../components/Loader';
import { PencilIcon, CheckIcon, XMarkIcon } from '../components/Icons';

const ProfileField: React.FC<{ label: string; value: string | number; isEditing: boolean; onChange: (value: string) => void; type?: string }> = ({ label, value, isEditing, onChange, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        {isEditing ? (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        ) : (
            <p className="mt-1 text-lg text-gray-800">{value} {type === 'number' && (label.includes('kg') ? 'kg' : label.includes('cm') ? 'cm' : '')}</p>
        )}
    </div>
);

const MyProfile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    if (!user || !formData) {
        return <div className="flex justify-center items-center h-full"><Loader /></div>;
    }

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset changes if cancelling
            setFormData(user);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof User, value: string | number) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = async () => {
        if (formData) {
            await updateUser(formData);
            setIsEditing(false);
        }
    };

    return (
        <div>
            <PageHeader title="내 프로필" subtitle="개인 정보를 확인하고 수정할 수 있습니다." />

            <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full" />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500">{user.age}세</p>
                        </div>
                    </div>
                    <div>
                        {isEditing ? (
                             <div className="flex gap-2">
                                <button onClick={handleSave} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200">
                                    <CheckIcon className="w-6 h-6" />
                                </button>
                                 <button onClick={handleEditToggle} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleEditToggle} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                                <PencilIcon className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField
                        label="이름"
                        value={formData.name}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('name', val)}
                    />
                     <ProfileField
                        label="나이"
                        value={formData.age}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('age', Number(val))}
                        type="number"
                    />
                     <ProfileField
                        label="현재 체중 (kg)"
                        value={formData.weight}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('weight', Number(val))}
                        type="number"
                    />
                     <ProfileField
                        label="신장 (cm)"
                        value={formData.height}
                        isEditing={isEditing}
                        onChange={(val) => handleInputChange('height', Number(val))}
                        type="number"
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
