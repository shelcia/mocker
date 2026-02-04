import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type CustomJSONTableProps = {
  keys?: string[];
  data: Array<Record<string, any>>;
};

export const CustomJSONTable = ({ keys = [], data }: CustomJSONTableProps) => {
  const hasKeys = Array.isArray(keys) && keys.length > 0;

  return (
    <div className="w-full overflow-x-auto rounded-md border bg-background">
      <Table>
        {hasKeys && (
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              {keys.map((key) => (
                <TableHead key={key} className="whitespace-nowrap font-semibold">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}

        <TableBody>
          {data?.map((row, idx) => (
            <TableRow key={idx}>
              {keys.map((key) => {
                const isId = key === 'id';
                const value = row?.[key];

                return (
                  <TableCell
                    key={key}
                    className={[
                      'align-top',
                      isId ? 'max-w-[10rem] truncate whitespace-nowrap' : '',
                    ].join(' ')}
                    title={isId ? String(value ?? '') : undefined}
                  >
                    {value == null ? '' : String(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
