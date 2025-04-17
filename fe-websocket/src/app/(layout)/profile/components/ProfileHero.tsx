import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/types/user';
import {Button} from "@mantine/core";
import {IconUserPlus} from "@tabler/icons-react";
import { RiUserFollowLine } from "react-icons/ri";
import { IoMdMore } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import React from "react";

interface ProfileHeroProps {
  user: User;
  isCurrentUser: boolean;
}

const renderBio = (bio: string | null | undefined) => {
  if (!bio || bio.trim() === '') {
    return <span className="italic text-gray-400">Chưa có mô tả cá nhân.</span>;
  }

  return bio.split('\n').map((line, index) => (
      <p key={index} className="text-gray-800 leading-relaxed">
        {line}
      </p>
  ));
};

export default function ProfileHero({ user, isCurrentUser }: ProfileHeroProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-65 w-full relative overflow-hidden">
        <Image
          src={'/backgroundprofile.png'}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg"
          >
            <Image
              src={user.avatar || '/image-person.png'}
              alt={user.username}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-primery">{user.fullName}</h1>
            <p className="text-gray-600 mt-1">@{user.username}</p>
            <div className="mt-1 italic max-w-md space-y-1">
              {renderBio(user.bio)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {isCurrentUser ? (
              <Button
                className="px-6 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors duration-200"
              >
                Chỉnh sửa trang cá nhân
              </Button>
            ) : (
              <>
                {user.isFollowing ? (
                    <Button
                        variant="light"
                        size="sm"
                        radius="md"
                        className="transition-all duration-200 bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212]"
                        leftSection={<RiUserFollowLine size={14} className="text-[#262626] dark:text-[#FAFAFA]"/>}
                    >
                      Đang theo dõi
                    </Button>
                ) : (
                    <Button
                        variant="filled"
                        size="sm"
                        radius="md"
                        className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white hover:opacity-90 transition-all duration-200"
                        leftSection={<IconUserPlus size={14} />}
                    >
                      Theo dõi
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    radius="md"
                    className="border border-[#DBDBDB] dark:border-[#262626] text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-all duration-200"
                    leftSection={<AiOutlineMessage size={14} />}
                >
                  Message
                </Button>
              </>
            )}
            <Button
                variant="subtle"
                size="sm"
                radius="md"
                className="text-[#262626] dark:text-[#FAFAFA] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-all duration-200"
            >
              <IoMdMore size={24}/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
