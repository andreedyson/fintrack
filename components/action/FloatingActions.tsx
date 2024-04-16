import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, PlusCircle } from "lucide-react";
import QuickActions from "./QuickActions";

function FloatingActions() {
  return (
    <Popover>
      <PopoverTrigger className="flex size-16 items-center justify-center rounded-full bg-black p-2">
        <PlusCircle color="#50ddb3" className="size-14" />
      </PopoverTrigger>
      <PopoverContent className="mr-12 w-[200px]">
        <QuickActions isHorizontal />
      </PopoverContent>
    </Popover>
  );
}

export default FloatingActions;
