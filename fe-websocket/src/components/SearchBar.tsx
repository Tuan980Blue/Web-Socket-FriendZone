import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Avatar } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/userService';
import { User as UserType } from '@/types/user';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        try {
          const results = await userService.searchUsers(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUserClick = (userId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFocused(false);
    setSearchQuery('');
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
      <div className="relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] dark:text-[#A0A0A0]" 
          size={20} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search friends..."
          className="w-full pl-10 pr-10 py-2 rounded-full bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] focus:outline-none focus:ring-2 focus:ring-[#DD2A7B] transition-all duration-300"
          onFocus={() => setIsFocused(true)}
          suppressHydrationWarning
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] dark:text-[#A0A0A0] hover:text-[#262626] dark:hover:text-[#FAFAFA]"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isFocused && (searchQuery || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#121212] rounded-lg shadow-lg border border-[#DBDBDB] dark:border-[#262626] max-h-[362px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-[#666666] dark:text-[#A0A0A0]">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  onClick={handleUserClick(user.id)}
                  className="flex items-center px-4 py-2 hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-200"
                >
                  <div className="relative w-10 h-10 mr-3">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#515BD4] animate-gradient-xy"></div>
                    <div className="relative p-0.5 rounded-full bg-white dark:bg-[#121212]">
                      <Avatar
                        src={user.avatar || '/image-person.png'}
                        alt={user.username}
                        size="md"
                        radius="xl"
                        className="border-2 border-white dark:border-[#121212]"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#262626] dark:text-[#FAFAFA] truncate">
                        {user.username}
                      </p>
                      {user.status === 'ONLINE' && (
                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[#666666] dark:text-[#A0A0A0] truncate">
                        {user.fullName}
                      </p>
                      <span className="text-xs text-[#666666] dark:text-[#A0A0A0]">•</span>
                      <p className="text-xs text-[#666666] dark:text-[#A0A0A0]">
                        {user.followersCount.toLocaleString()} {user.followersCount === 1 ? 'follower' : 'followers'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-4 text-center text-[#666666] dark:text-[#A0A0A0]">
              No results found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 