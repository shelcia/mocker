import { Avatar, AvatarFallback } from '../ui/avatar';

interface CustomAvatarDisplaynameProps {
  text?: string;
  open?: boolean;
}

export const CustomAvatarDisplayname = ({ text, open = true }: CustomAvatarDisplaynameProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarFallback className="text-sm font-medium">
          {text?.charAt(0)?.toUpperCase() ?? 'P'}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight min-w-0">
        <div className="text-sm font-medium text-foreground group-hover:text-blue-400">{text}</div>
        {open && <div className="text-xs text-muted-foreground">Open project</div>}
      </div>
    </div>
  );
};

interface CustomLoadingModalBlockProps {
  text: string;
}

export const CustomLoadingModalBlock = ({ text }: CustomLoadingModalBlockProps) => {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-progress rounded-full bg-primary" />
      </div>

      <p className="text-sm font-medium text-primary">{text}</p>
    </div>
  );
};
