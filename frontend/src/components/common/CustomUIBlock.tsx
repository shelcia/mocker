import { Avatar, AvatarFallback } from '../ui/avatar';

export const CustomAvatarDisplayname = ({
  text,
  open = true,
}: {
  text?: string;
  open?: boolean;
}) => {
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
