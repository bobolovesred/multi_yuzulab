
import React from 'react';
import { APP_NAME } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ui-surface border-t border-ui-border text-center py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <p className="text-sm text-content-secondary">&copy; {new Date().getFullYear()} {APP_NAME}. Все права защищены.</p>
      <p className="text-xs text-content-subtle mt-2">Визуальный макет предоставлен Yuzu.Lab</p>
    </footer>
  );
};