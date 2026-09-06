import React from 'react';

// Legacy component - replaced by DetectiveShop
interface AvatarShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarShop: React.FC<AvatarShopProps> = ({ isOpen, onClose }) => {
  // This component is no longer used - DetectiveShop replaces it
  if (!isOpen) return null;
  return null;
};
