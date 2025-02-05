import { Box, Popover, Typography } from "@mui/material";

function MessageModal({ open, handleClose, anchorEl, alertMessage, id }) {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      sx={{
        zIndex: 1,
        top: 15,
        left: -10,
        ".MuiPopover-paper": {
          width: "620px",
          backgroundImage:
            "linear-gradient(191deg, rgba(238,222,1,1) 0%, rgba(249,140,7,1) 100%)",
          p: "2px",
          borderRadius: 2,
        },
      }}
    >
      <Box sx={{ bgcolor: "#25252D", borderRadius: 2, py: 2, px: 10 }}>
        <Typography
          sx={{ textAlign: "center", color: "white", fontSize: "26px", fontWeight: "bold" }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          {alertMessage} 
        </Typography>
      </Box>
    </Popover>
  );
}

export default MessageModal;
