import {
  Box,
  Paper,
  IconButton,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  CalanderIcon,
  CheckedInIcon,
  CheckIcon,
  LeftArrowIcon,
  RightArrowIcon,
} from "../../../../assets/Icones";
import ViewButton from "../../../../public/icons/viewButton.png";
import moment from "moment";
import { get_game_result } from "../../../../api/gameData";
import useLocalStorage from "../../../../utils/useLocalStorage";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  // createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  // createData("Eclair", 262, 16.0, 24, 6.0),
  // createData("Cupcake", 305, 3.7, 67, 4.3),
  // createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function Result() {
  const dateRef = useRef(null);
  const [date, setDate] = useState(moment());
  const [pageNum, setPageNum] = useState(1)
  const [gameResult, setGameResult] = useState([])
  const [idLocl, setLocalid] = useLocalStorage("userDetails", {});


  const handleIconClick = () => {
    console.log(dateRef);

    if (dateRef.current) {
      // dateRef.current.click(); // Programmatically trigger the click on the hidden input
      dateRef.current.showPicker();
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value; // Get the selected date as a string
    setDate(moment(selectedDate)); // Update the state with the new date
  };

  const fetchGameResult = async () => {
    // const response = await fetchGameReport(idLocl.id, pageNum);
    // setGameResult(response.response.data);
    const response = await get_game_result();
    if (response.status === 200) {
      setGameResult(response.data);
    }
  };

  useEffect(() => {
    fetchGameResult();
  }, [pageNum]);

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ bgcolor: "#FFE5C6", height: "93%" ,fontFamily:"Poppins-Bold",fontSize:"13.16px"}}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              SELECT DATE : {date.format("DD/MM/YYYY")}
            </Typography>
            <IconButton onClick={handleIconClick}>
              <input
                ref={dateRef}
                type="date"
                style={{ visibility: "hidden", width: "0px" }}
                onChange={handleDateChange}
              />
              <CalanderIcon />
            </IconButton>

            <FormControlLabel
              value="all"
              control={
                <Checkbox
                  checkedIcon={<CheckedInIcon />}
                  icon={<CheckIcon />}
                />
              }
              label="ALL"
              labelPlacement="end" // 'end' is the correct value for label placement; 'all' is invalid
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
              }}
            />

            <Button
              value="result"
              aria-label="left aligned"
              sx={{
                width: "124px",
                borderRadius: 3,
                p: 0,
                "& .MuiTypography-root": {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#042655",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                },
              }}
            >
              <img
                src={ViewButton}
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
              <Typography>VIEW</Typography>
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => setPageNum(prev => prev > 1 ? prev-1 : prev )}>
              <LeftArrowIcon />
            </IconButton>
            <Typography>{pageNum}</Typography>
            <IconButton>
              <RightArrowIcon onClick={() => setPageNum(prev => prev <= 100 ? prev+1 : prev )}/>
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ 
          maxHeight: '400px', 
          overflow: 'auto',
          '& .MuiTableContainer-root': {
            maxHeight: '100%',
          },
          '& .MuiTableHead-root': {
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: "rgba(255,180,193,39)",
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: "rgba(255,180,193,39)",
          }
        }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 650, borderSpacing: "0 20px", tableLayout: 'fixed' }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow
                  sx={{
                    th: {
                      mb: 1,
                      border: 0,
                      fontSize: "17px",
                      fontWeight: "600",
                      borderBottom: "6px solid #FFE5C6",
                    },
                  }}
                >
                  <TableCell sx={{ width: "50%", fontSize: "0.9rem !important" }}>
                    DRAW TIME
                  </TableCell>
                  <TableCell sx={{ width: "50%", fontSize: "0.9rem !important" }}>
                    RESULT
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gameResult.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "td,th": {
                        mb: 10,
                        bgcolor: "#FFFFFF",
                        borderBottom: "6px solid #FFE5C6",
                        fontWeight: "bold",
                      },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.spinnerNumber}
                    </TableCell>
                    <TableCell>{row.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </TableContainer>
    </>
  );
}

export default Result;
