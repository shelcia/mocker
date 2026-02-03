import React, { useContext, useState } from 'react';
import CustomModal from '../../../components/CustomModal';
import { ThemeContext } from '../../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '../../../services/api';
import { ENDPOINTS } from '@/data/constants';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { copyTextToClipboard } from '@/utils';

const EndpointModal = ({ open, setOpen, result }) => {
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
                <TableCell className="font-semibold text-green-500 w-24">{point.method}</TableCell>

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
