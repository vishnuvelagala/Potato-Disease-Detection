
import React from "react";
import { Loader2 } from "lucide-react";

const HistoryLoading: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-potato-600" />
  </div>
);

export default HistoryLoading;
