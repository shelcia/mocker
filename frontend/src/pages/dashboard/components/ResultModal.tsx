import React, { useContext, useState } from 'react';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import JSONPretty from 'react-json-pretty';
import toast from 'react-hot-toast';
import jsonBeautify from 'json-beautify';

import CustomModal from '../../../components/CustomModal';
import { CopyButton } from '../../../components/CustomButtons';
import { PartLoader } from '../../../components/CustomLoading';
import { CustomTabs, CustomTabPanel } from '../../../components/CustomTabPanel';
import { CustomJSONTable } from '../../../components/CustomTable';
import { ThemeContext } from '../../../context/ThemeContext';
import { secondary } from '../../../themes/themeColors';
import { copyTextToClipboard } from '../../../utils/utils';

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
      console.error(error);
      toast.error("Couldn't copy!");
    }
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <CustomModal open={open} setOpen={setOpen} width={600} title="Result">
      <CustomTabs value={value} handleChange={handleChange} items={['JSON View', 'Table View']} />

      <CustomTabPanel value={value} index={0}>
        <Box
          sx={{
            bgcolor: darkTheme ? secondary[900] : grey[100],
            p: 2,
            overflowX: 'auto',
          }}
        >
          <CopyButton
            onClick={copyJsonBeautify}
            sx={{ marginLeft: '90%' }}
            disabled={isBeautifyCopied}
          >
            {isBeautifyCopied ? 'Done' : 'Copy'}
          </CopyButton>

          {loading ? (
            <PartLoader />
          ) : (
            <Box className={darkTheme ? 'lang-dark' : 'lang-light'}>
              <JSONPretty id="json-pretty" data={result} />
            </Box>
          )}
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <CustomJSONTable keys={result[0] ? Object.keys(result[0]) : []} data={result} />
      </CustomTabPanel>
    </CustomModal>
  );
};

export default ResultModal;
