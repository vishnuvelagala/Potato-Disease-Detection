
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HistoryEmpty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-potato-100">
      <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-potato-50 p-4 mb-4">
          <FileSearch className="h-8 w-8 text-potato-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">No detection history</h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          You haven't performed any potato disease detection analyses yet.
        </p>
        <Button
          className="potato-btn-primary"
          onClick={() => navigate('/upload')}
        >
          Upload an Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default HistoryEmpty;
