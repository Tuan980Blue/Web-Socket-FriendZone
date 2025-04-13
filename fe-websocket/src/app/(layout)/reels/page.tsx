'use client';

import { useState } from 'react';
import ReelViewer from './components/ReelViewer';
import ReelGrid from './components/ReelGrid';
import { useReelsData } from '@/hooks/useReelsData';
import { Reel } from '@/types/reel';
import { Button, SegmentedControl, Modal, Skeleton, Grid } from '@mantine/core';
import { Upload } from 'lucide-react';

export default function ReelsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'full'>('grid');
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { reels, isLoading, error } = useReelsData();

  // Handle reel click
  const handleReelClick = (reel: Reel) => {
    setSelectedReel(reel);
    setViewMode('full');
  };

  // Handle navigation between reels
  const handleNextReel = () => {
    if (!selectedReel) return;
    
    const currentIndex = reels.findIndex(reel => reel.id === selectedReel.id);
    if (currentIndex < reels.length - 1) {
      setSelectedReel(reels[currentIndex + 1]);
    }
  };

  const handlePrevReel = () => {
    if (!selectedReel) return;
    
    const currentIndex = reels.findIndex(reel => reel.id === selectedReel.id);
    if (currentIndex > 0) {
      setSelectedReel(reels[currentIndex - 1]);
    }
  };

  // Handle view mode change
  const handleViewModeChange = (value: string) => {
    setViewMode(value as 'grid' | 'full');
    if (value === 'grid') {
      setSelectedReel(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <Skeleton height={36} width={200} />
          <Skeleton height={36} width={120} />
        </div>
        <Grid>
          {[...Array(6)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Skeleton height={400} radius="md" />
              <Skeleton height={20} width="70%" mt="sm" />
              <Skeleton height={20} width="40%" mt="xs" />
            </Grid.Col>
          ))}
        </Grid>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <SegmentedControl
          value={viewMode}
          onChange={handleViewModeChange}
          data={[
            { label: 'Grid View', value: 'grid' },
            { label: 'Full View', value: 'full' },
          ]}
        />
        <Button
          leftSection={<Upload size={20} />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Reel
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <ReelGrid reels={reels} onReelClick={handleReelClick} />
      ) : selectedReel && (
        <ReelViewer
          reel={selectedReel}
          onNext={handleNextReel}
          onPrev={handlePrevReel}
        />
      )}

      <Modal
        opened={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Reel"
        size="lg"
      >
        {/* Upload form content */}
      </Modal>
    </div>
  );
}
