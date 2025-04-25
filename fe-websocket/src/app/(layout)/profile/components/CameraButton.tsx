import { IconCamera } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface CameraButtonProps {
  onClick: () => void;
}

export default function CameraButton({ onClick }: CameraButtonProps) {
  return (
    <motion.div
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer rounded-full"
      onClick={onClick}
    >
      <IconCamera size={24} className="text-white" />
    </motion.div>
  );
} 