import { Box, Button, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import token from "../../../public/icons/token.png";

function BetNumbers({ betNumList, betButtonClick, betremoveClick, chipSound, isDisabled }) {

  return (
    <Box sx={{ flexGrow: 1,marginTop:"2rem",width: "40rem",fontFamily:"Poppins-Regular" }}>
      <Grid container spacing={2} sx={{ width: "40rem" }}>
        {betNumList.map((e, i) => (
          <Grid size={2.4} key={i + 1}>
            <Button
              disabled={isDisabled}
              component={Paper}
              elevation={0}
              sx={{
                bgcolor: e.color || "#042655",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 1,
                borderRadius: "8.75px",
                fontFamily:"Poppins-Medium",
                WebkitTextStroke:"1px #000",
                width: "7.094rem",
                height:"7.997rem"
              }}
              onClick={() => {
                betButtonClick(i);
                chipSound.play();
              }}
              onContextMenu={(event) => {
                event.preventDefault(); // Prevents the default context menu
                // Add your right-click function here, for example:
                betremoveClick(i);
                chipSound.play();
              }}
            >
              <Typography
                sx={{
                  fontSize: "3rem",
                 
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins-Medium",
                  lineHeight: "1.2",
                }}
              >
                {e.num}
              </Typography>
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "8.75px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  width: "100%",
                  height: "38px",
                }}
              >
                {e.token > 0 && (
                  <>
                    <img
                      src={token}
                      alt=""
                      style={{ height: "21px", width: "21px" }}
                    />
                    <Typography
                      sx={{
                        // fontSize: "17.56px",
                        fontWeight: "700",
                        color: "#042655",
                        fontSize:"1.2rem",
                        // fontFamily: "Hemlets-ExtraBold",
                  
                      }}
                    >
                      {e.token}
                    </Typography>
                  </>
                )}
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BetNumbers;
