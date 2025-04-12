'use client'

import Image from 'next/image';
import { User } from '@/types/user';
import {Avatar, Button} from "@mantine/core";
import {Camera, UserPlus} from "lucide-react";
import {useState} from "react";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  stats: {
    friends: number;
    posts: number;
    photos: number;
    likes: number;
  };
}

export default function ProfileHeader({ user, isOwnProfile, stats }: ProfileHeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '/default-avatar.png');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="h-64 w-full relative">
        <Image
          src={user.coverPhoto || '/backgroundprofile.png'}
          alt="Cover photo"
          fill
          className="object-cover"
        />
      </div>

      {/* Profile Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-4">
            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
              <Avatar
                  src={user.avatar || undefined}
                  alt={user.username || ""}
                  radius="xl"
                  size="2xl"
                  className={""}
              >
                {user.username?.charAt(0).toUpperCase() || "H"}
              </Avatar>
              {isOwnProfile && (
                  <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                  </label>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="ml-40 pt-16 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>

            {/* Action Buttons */}
            <div className="mt-4">
              {isOwnProfile ? (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <Button className="mt-2">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </Button>
                  <Button className="mt-2">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <span className="block text-xl font-bold">{stats.friends}</span>
                <span className="text-gray-500">Friends</span>
              </div>
              <div>
                <span className="block text-xl font-bold">{stats.posts}</span>
                <span className="text-gray-500">Posts</span>
              </div>
              <div>
                <span className="block text-xl font-bold">{stats.photos}</span>
                <span className="text-gray-500">Photos</span>
              </div>
              <div>
                <span className="block text-xl font-bold">{stats.likes}</span>
                <span className="text-gray-500">Likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 