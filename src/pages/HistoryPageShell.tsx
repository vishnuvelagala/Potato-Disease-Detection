
import React from 'react';
import HistoryPageContent from '@/components/history/HistoryPageContent';
import { ChatDialog } from '@/components/chat/ChatDialog';

const HistoryPageShell: React.FC = () => (
  <div className="flex flex-col min-h-[calc(100vh-4rem)]">
    <div className="container px-4 py-12 mx-auto max-w-5xl">
      <HistoryPageContent />
    </div>
    <ChatDialog />
  </div>
);

export default HistoryPageShell;
