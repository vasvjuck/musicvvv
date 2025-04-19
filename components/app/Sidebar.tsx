import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlayCircle, Radio } from "lucide-react";

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <PlayCircle className="mr-2 h-4 w-4" />
              Listen Now
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              <Radio className="mr-2 h-4 w-4" />
              Radio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
