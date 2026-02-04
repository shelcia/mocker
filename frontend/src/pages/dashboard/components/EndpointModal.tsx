import React, { useContext, useState } from 'react';

import { CustomModal } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ThemeContext } from '@/context/ThemeContext';
import { ENDPOINTS } from '@/data/constants';
import { cn } from '@/lib/utils';
import { BACKEND_URL } from '@/services/api';
import { copyTextToClipboard } from '@/utils';

import { toast } from 'react-hot-toast';

interface EndpointModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Resource / project id used to generate endpoints
   */
  result: string;
}

const EndpointModal = ({ open, setOpen, result }: EndpointModalProps) => {
  const [darkTheme] = useContext(ThemeContext);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(-1);

  const handleCopyClick = (data, idx) => {
    copyTextToClipboard(data)
      .then(() => {
        setIsCopied(true);
        setSelectedId(idx);
        toast.success('Copied !');
        setTimeout(() => {
          setIsCopied(false);
          setSelectedId(-1);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't copy !");
      });
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600} title="Endpoints">
      <div
        className={cn(
          'rounded-lg p-4 overflow-x-auto border',
          darkTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200',
        )}
      >
        <Table>
          <TableBody>
            {ENDPOINTS.map((point, idx) => (
              <TableRow key={idx} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-emerald-600 w-24">
                  {point.method}
                </TableCell>

                <TableCell className="font-mono text-sm">
                  /{result}
                  {point.endpoint}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopyClick(`${BACKEND_URL}/user/${result}${point.endpoint}`, idx)
                    }
                    disabled={isCopied && selectedId === idx}
                  >
                    {isCopied && selectedId === idx ? 'Copied' : 'Copy'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CustomModal>
  );
};

export default EndpointModal;
