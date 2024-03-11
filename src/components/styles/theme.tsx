import {
  createTheme,
  styled,
  TableCell,
  tableCellClasses,
  TableRow,
} from '@mui/material';

export const AppTheme = createTheme({
  palette: { primary: { main: '#385aa8' }, secondary: { main: '#4891ce' } },
  typography: {
    allVariants: {
      textAlign: 'center',
    },
    h3: {
      color: '#385aa8',
    },
    h4: {
      color: '#385aa8',
    },
  },
});

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 20,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#4891ce',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#77caf2',
  },
  '&:hover': {
    backgroundColor: '#f6f740',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
