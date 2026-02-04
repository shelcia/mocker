import React, { useContext, useState } from 'react';

import { CustomJSONTable,CustomModal, PartLoader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeContext } from '@/context/ThemeContext';
import { copyTextToClipboard } from '@/utils';

import jsonBeautify from 'json-beautify';
import toast from 'react-hot-toast';
import JSONPretty from 'react-json-pretty';

type ResultRow = Record<string, unknown>;

interface ResultModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  result?: ResultRow[];
  loading: boolean;
}

const ResultModal = ({ open, setOpen, result = [], loading }: ResultModalProps) => {
  const [darkTheme] = useContext(ThemeContext);

  const [isBeautifyCopied, setIsBeautifyCopied] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);

  const copyJsonBeautify = async () => {
    try {
      const beautifiedJson = jsonBeautify(result, null, 1, 1);

      await copyTextToClipboard(beautifiedJson);
      setIsBeautifyCopied(true);
      toast.success('Copied!');
      setTimeout(() => setIsBeautifyCopied(false), 5000);
    } catch (error) {
      toast.error("Couldn't copy!");
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600} title="Result">
      <Tabs
        value={String(value)}
        onValueChange={(v) => handleChange(null, Number(v))}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="0">JSON View</TabsTrigger>
          <TabsTrigger value="1">Table View</TabsTrigger>
        </TabsList>

        {/* --- JSON View --- */}
        <TabsContent value="0" className="mt-3 w-full">
          <div
            className={[
              'relative rounded-lg border p-4',
              'overflow-hidden', // keeps padding clean
              'bg-muted/60',
              darkTheme ? 'bg-zinc-950/40' : '',
            ].join(' ')}
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyJsonBeautify}
              disabled={isBeautifyCopied}
              className="absolute right-3 top-3"
            >
              {isBeautifyCopied ? 'Done' : 'Copy'}
            </Button>

            {loading ? (
              <PartLoader />
            ) : (
              <ScrollArea className="max-h-[420px] w-full rounded-md">
                <div className={darkTheme ? 'lang-dark' : 'lang-light'}>
                  <JSONPretty id="json-pretty" data={result} />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        {/* --- Table View --- */}
        <TabsContent value="1" className="mt-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <CustomJSONTable keys={result?.[0] ? Object.keys(result[0]) : []} data={result} />
          </div>
        </TabsContent>
      </Tabs>
    </CustomModal>
  );
};

export default ResultModal;
