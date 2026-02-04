import React from 'react';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface CustomTooltipProps {
  onClickFn: () => void;
  text: string;
  variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  children: React.ReactNode;
  icon?: boolean;
}

const CustomTooltip = ({
  onClickFn,
  text,
  variant = 'default',
  children,
  icon = true,
}: CustomTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex">
          <Button
            size={icon ? 'icon' : 'default'}
            onClick={onClickFn}
            aria-label={text}
            variant={variant}
            className="cursor-pointer"
          >
            {children}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
