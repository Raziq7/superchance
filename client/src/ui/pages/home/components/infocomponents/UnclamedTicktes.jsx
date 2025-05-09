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
  Modal,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  CalanderIcon,
  CancleButton,
  CheckedInIcon,
  CheckIcon,
  LeftArrowIcon,
  RightArrowIcon,
} from "../../../../assets/Icones";
import ViewButton from "../../../../public/icons/viewButton.png";
import moment from "moment";
import {
  cancel_game,
  claim_unclamed_tickets,
  clame_all_tickets,
  get_single_view,
  get_unclamed_tickets,
} from "../../../../api/gameData";
import { useLocalStorage } from "@uidotdev/usehooks";
import { printer_bill } from "../../../../utils/functions";

function UnclamedTicktes({ fetchBalance }) {
  const dateRefFrom = useRef(null);
  const dateRefTo = useRef(null);
  const [date, setDate] = useState({
    from: moment(),
    to: moment(),
  });
  const [pageNum, setPageNum] = useState(1);
  const [historyList, setHistoryList] = useState([]);
  const [idLocl, setLocalid] = useLocalStorage("userDetails", {});
  const [ticketID, setTicketID] = useState("");
  const [gameID, setGameID] = useState("");
  const [ticketObj, setticketObj] = useState({});
  const [open, setOpen] = useState(false);
  const [singleViewList, setSingleViewList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const handleIconClickFrom = () => {
    if (dateRefFrom.current) {
      // dateRef.current.click(); // Programmatically trigger the click on the hidden input
      dateRefFrom.current.showPicker();
    }
  };

  const handleIconClickTo = () => {
    if (dateRefTo.current) {
      // dateRef.current.click(); // Programmatically trigger the click on the hidden input
      dateRefTo.current.showPicker();
    }
  };

  const handleDateChangeFrom = (event) => {
    const selectedDate = event.target.value; // Get the selected date as a string
    setDate({ ...date, from: moment(selectedDate) }); // Update the state with the new date
  };

  const handleDateChangeTo = (event) => {
    const selectedDate = event.target.value; // Get the selected date as a string
    setDate({ ...date, to: moment(selectedDate) }); // Update the state with the new date
  };

  const handleClose = () => {
    setOpen(false);
    setTicketID(null);
    setGameID(null);
  };

  const handleRowClick = (obj) => {
    setTicketID(obj.ticket_id === ticketID ? null : obj.ticket_id);
    setGameID(obj.game_id === gameID ? null : obj.game_id);
    setticketObj(obj);
    setSingleViewList(obj.data);
  };

  const handleViewClick = () => {
    // setOpen(true);/
    handleRefreshClick();
  };

  const handleRefreshClick = () => {
    setIsLoading(true);
    get_unclamed_tickets().then((data) => {
      setHistoryList(data.data.bets);
      setIsLoading(false);
    });
  };

  const handleAllClaimClick = async () => {
    await clame_all_tickets(idLocl.id);
    handleRefreshClick();
    // setOpen(true);
  };

  const handleDetailsClick = () => {
    // if (ticketID && gameID) {
    //   get_single_view(ticketID, gameID).then((data) => {
    //     if (data.statusCode === 200) {
    //       setSingleViewList(data.response);
          setOpen(true);
    //     }
    //   });
    // }
  };

  const handleReprintClick = () => {
    // if (ticketID && gameID) {
      // get_single_view(ticketID, gameID).then((data) => {
      //   if (data.statusCode === 200) {
      //     const fileterlist = data.response.map((e) => {
      //       return {
      //         num: e.bet,
      //         token: e.played,
      //       };
      //     });
      let isPrinterEnabled = JSON.parse(localStorage.getItem("isPrinterEnabled"));
          if (isPrinterEnabled) {
            printer_bill(
              ticketObj.ticket_id,
              moment(ticketObj.draw_time, "HH:mm:ss.SSSSSS").format("hh:mm A"),
              moment(ticketObj.ticket_time, "HH:mm:ss.SSSSSS").format("hh:mm A"),
              ticketObj.played,
            ticketObj.data
          );
        }
    //     }
    //   });
    // }
  };

  const handleClaimClick = async () => {
    // setOpen(true);
    const res = await claim_unclamed_tickets(ticketObj._id);
    if (res.status === 200 ){
      handleRefreshClick()
      fetchBalance()
    }
  };

  const handleCancelClick = () => {
    // setOpen(true);
    cancel_game(ticketID, gameID).then((data) => {
      // console.log(data);
      if (data.statusCode === 200) {
        handleRefreshClick();
      }
    });
  };

  const handleSetColor = (key) => {
    switch (key) {
      case "won":
        return "secondary.main";

      case "Pending":
        return "primary.main";

      default:
        return "warning.main";
    }
  };

  useEffect(() => {
    handleRefreshClick()
  }, []);

  return (
    <>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ bgcolor: "#FFE5C6", height: "89%" }}
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
                FROM : {date.from.format("DD/MM/YYYY")}
              </Typography>
              <IconButton onClick={handleIconClickFrom}>
                <input
                  ref={dateRefFrom}
                  type="date"
                  style={{ visibility: "hidden", width: "0px" }}
                  onChange={handleDateChangeFrom}
                />
                <CalanderIcon />
              </IconButton>

              <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                TO : {date.to.format("DD/MM/YYYY")}
              </Typography>
              <IconButton onClick={handleIconClickTo}>
                <input
                  ref={dateRefTo}
                  type="date"
                  style={{ visibility: "hidden", width: "0px" }}
                  onChange={handleDateChangeTo}
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
                onClick={handleViewClick}
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
              <IconButton
                onClick={() =>
                  setPageNum((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <LeftArrowIcon />
              </IconButton>
              <Typography>{pageNum}</Typography>
              <IconButton>
                <RightArrowIcon
                  onClick={() =>
                    setPageNum((prev) => (prev <= 100 ? prev + 1 : prev))
                  }
                />
              </IconButton>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: "400px", overflow: "auto" }}>
            <Table
              stickyHeader
              sx={{
                // minWidth: 650,
                // borderSpacing: "0 20px",
                // tableLayout: 'fixed',
                "& .MuiTableCell-stickyHeader": {
                  backgroundColor: "rgba(255,180,193,39)",
                  // borderBottom: "6px solid #FFE5C6",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                },
              }}
              // aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Game ID</TableCell>
                  <TableCell>Start Point</TableCell>
                  <TableCell>Played</TableCell>
                  <TableCell>Won</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>End Point</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Draw Time</TableCell>
                  <TableCell>Ticket Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                      >
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  historyList.map((row) => (
                    <TableRow
                      key={row.ticket_id}
                      sx={{
                        "td,th": {
                          // mb: 10,
                          cursor: "pointer",
                          bgcolor:
                            ticketID === row.ticket_id ? "#CACFDB" : "#FFFFFF",
                          borderBottom: "6px solid #FFE5C6",
                          fontWeight: "bold",
                        },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      onClick={() => handleRowClick(row)}
                    >
                      <TableCell component="th" scope="row">
                        {row.ticket_id}
                      </TableCell>
                      <TableCell>
                        {row.game_id}
                      </TableCell>
                      <TableCell>{row.startPoint}</TableCell>
                      <TableCell>
                        {row.data.reduce((sum, e) => sum + e.played, 0)}
                      </TableCell>
                      <TableCell>
                        {row.data.reduce((sum, e) => sum + e.won, 0)}
                      </TableCell>
                      <TableCell>{row.game_id}</TableCell>
                      <TableCell>{row.endPoint}</TableCell>
                      <TableCell
                        sx={{
                          color: handleSetColor(row.status),
                          textTransform: "uppercase",
                        }}
                      >
                        {row.status === "blank" ? '' : row.status}
                      </TableCell>
                      <TableCell>
                        {row?.result ? row.result + "-N" : ""}
                      </TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {moment(row.draw_time, "HH:mm:ss.SSSSSS").format(
                          "hh:mm A"
                        )}
                      </TableCell>
                      <TableCell>
                        {moment(row.ticket_time, "HH:mm:ss.SSSSSS").format(
                          "hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: 1,
          }}
        >
          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              value="all"
              control={
                <Checkbox
                  checkedIcon={<CheckedInIcon />}
                  icon={<CheckIcon />}
                />
              }
              label="PRINT CLAIM"
              labelPlacement="end" // 'end' is the correct value for label placement; 'all' is invalid
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.8rem",
                  // fontWeight: "bold",
                },
              }}
            />
            <FormControlLabel
              value="all"
              control={
                <Checkbox
                  checkedIcon={<CheckedInIcon />}
                  icon={<CheckIcon />}
                />
              }
              label="PRINT CANCEL"
              labelPlacement="end" // 'end' is the correct value for label placement; 'all' is invalid
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.8rem",
                  // fontWeight: "bold",
                },
              }}
            />
          </Box> */}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MiniButton name={"REFRESH"} onClick={handleRefreshClick} />
            <MiniButton name={"ALL CLAIM"} onClick={handleAllClaimClick} />
            <MiniButton name={"DETAILS"} onClick={handleDetailsClick} />
            <MiniButton name={"REPRINT"} onClick={handleReprintClick} />
            <MiniButton name={"CLAIM"} onClick={handleClaimClick} />
            <MiniButton name={"CANCEL"} onClick={handleCancelClick} />
          </Box>
        </Box>
      </Box>
      <GameHistoryModal
        open={open}
        handleClose={handleClose}
        singleViewList={singleViewList}
      />
    </>
  );
}

export default UnclamedTicktes;

const MiniButton = function ({ name, onClick }) {
  return (
    <Button
      value="result"
      aria-label="left aligned"
      onClick={onClick}
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
      <img src={ViewButton} alt="" style={{ width: "100%", height: "100%" }} />
      <Typography>{name}</Typography>
    </Button>
  );
};

const GameHistoryModal = function ({ open, handleClose, singleViewList }) {
  console.log(singleViewList);
  return (
    <Modal
      open={open}
      //   onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(45vw - 80px)",
          height: 515,
          backgroundPosition: "center",
          boxShadow: 24,
          zIndex: 99999,
          bgcolor: "#D6D6D6",
          //   border: "2px solid #000",
          // p: 4,
          //   backgroundImage: "url('../backgrounds/bgModal.png')",
          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "cover",
        }}
      >
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <IconButton onClick={() => handleClose()}>
            <CancleButton sx={{ fontSize: "35px" }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, pt: 0 }}>
          <TableContainer
            sx={{
              maxHeight: "400px",
              height: "100%",
              overflow: "auto",
              bgcolor: "#EDE9D3",
              border: "1px solid black",
              // m: 4
            }}
          >
            <Table
              stickyHeader
              sx={{
                // minWidth: 650,
                // borderSpacing: "0 20px",
                // tableLayout: 'fixed',
                "& .MuiTableCell-stickyHeader": {
                  backgroundColor: "#D3C891",
                  border: "none",
                  borderBottom: "6px solid #FFE5C6",
                  fontWeight: "700",
                  fontSize: "0.9rem",
                  fontFamily: "Poppins",
                },
                "& .MuiTableCell-root": {
                  fontFamily: "Poppins",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                },
              }}
              // aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>BET POSITION</TableCell>
                  <TableCell>PLAY</TableCell>
                  <TableCell>WON</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {singleViewList.map((row) => (
                  <TableRow>
                    <TableCell>Singles : {row.bet}</TableCell>
                    <TableCell>{row.played}</TableCell>
                    <TableCell>{row.won}</TableCell>
                  </TableRow>
                ))}
                <TableRow></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Modal>
  );
};
