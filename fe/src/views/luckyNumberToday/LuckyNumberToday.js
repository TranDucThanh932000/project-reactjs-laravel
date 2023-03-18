import styles from "./LuckyNumberToday.module.scss";
import classNames from "classnames/bind";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { Button, Modal } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Fade from '@mui/material/Fade';
import * as luckyNumberService from '../../services/luckyNumberService'
import { connect } from "react-redux";
import { updateStatusLoading } from '../../store/actions/commonAction'
import store from '../../store'
import moment from 'moment';

const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
  };
};

const cx = classNames.bind(styles);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const LuckyNumberToday = () => {
  const [openPopupHistory, setOpenPopupHistory] = useState(false);
  const [rows, setRows] = useState([]);

  const [firstNum, setFirstNum] = useState('L');
  const [secondNum, setSecondNum] = useState('U');
  const [thirdNum, setThirdNum] = useState('C');
  const [fourthNum, setFourthNum] = useState('K');
  const [fifthNum, setFifthNum] = useState('Y');

  useEffect(async () => {
    var random, defaultNumber;
    await luckyNumberService.today()
    .then(res => {
      random = setInterval(() => {
        setFirstNum(Math.floor(Math.random() * 10));
        setSecondNum(Math.floor(Math.random() * 10));
        setThirdNum(Math.floor(Math.random() * 10));
        setFourthNum(Math.floor(Math.random() * 10));
        setFifthNum(Math.floor(Math.random() * 10));
      }, 50);
  
      defaultNumber = setTimeout(() => {
        setFirstNum(res.lucky_number[0]);
        setSecondNum(res.lucky_number[1]);
        setThirdNum(res.lucky_number[2]);
        setFourthNum(res.lucky_number[3]);
        setFifthNum(res.lucky_number[4]);
        clearInterval(random);
      }, 1000);
    })

    return () => {
      clearInterval(random);
      clearTimeout(defaultNumber);
    };
  }, []);

  const handleShowPopupHistory = async () => {
    store.dispatch(updateStatusLoading(true))
    await luckyNumberService.latest()
    .then((res) => {
      setOpenPopupHistory(true);
      setRows(res);
    })
    .finally(() => {
      store.dispatch(updateStatusLoading(false))
    })
  };

  return (
    <Box component="div">
      <Box>
        <Button variant="outlined" onClick={handleShowPopupHistory} color="secondary">
          Số may mắn 10 ngày gần nhất
        </Button>
        <Modal
          open={openPopupHistory}
          onClose={() => {
            setOpenPopupHistory(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Fade in={openPopupHistory}>
            <Box sx={style}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        <h3>Ngày</h3>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <h3>Số may mắn</h3>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.date}>
                          <StyledTableCell align="center">
                            {moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.lucky_number}
                          </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Fade>
        </Modal>
      </Box>
      <Box component="div" className={cx("center", "box_shadow")}>
        <Box component="span" className={cx("lucky_number")}>
          {firstNum}
        </Box>
        <Box component="span" className={cx("lucky_number")}>
          {secondNum}
        </Box>
        <Box component="span" className={cx("lucky_number")}>
          {thirdNum}
        </Box>
        <Box component="span" className={cx("lucky_number")}>
          {fourthNum}
        </Box>
        <Box component="span" className={cx("lucky_number")}>
          {fifthNum}
        </Box>
      </Box>
    </Box>
  );
};

export default connect(mapStateToProps)(LuckyNumberToday);
