import { Box, Typography, InputBase, IconButton, Button } from "@mui/material";
import { GameButton } from "../../components/Utils/StyledComponents";
import { Visbility } from "../../assets/Icones";
import SpinnerSound from "../../public/backgrounds/loginWeel.png";
import { useState } from "react";
import { login_user } from "../../api/gameAuth";
import TokenManager from "../../utils/TokenManager";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../utils/useLocalStorage";

function Login() {
  const navigate = useNavigate();
  const [local, setLocal] = useLocalStorage("userDetails", {});
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    message: "",
  });

  const submitForm = async function (e) {
    // setIsLoading(true);
    e.preventDefault();
    const res = await login_user(formData);
    console.log(res);
    if (res.statusCode === 200) {
      setIsLoading(false);
      // TokenManager.setAuthTokens(res.response.auth);
      // setLocal({ id: res.response.id, userName: res.response.userName });
      navigate("game");
    }
  };

  const logcook = function () {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    console.log(refreshToken);
    console.log(accessToken);
  };

  const handleClose = () => {
    window.electronAPI.close();
  };

  return (
    <Box
      sx={{
        background: "rgb(35,36,70)",
        backgroundImage:
          "linear-gradient(180deg, rgba(35,36,70,1) 0%, rgba(58,60,120,1) 55%, rgba(35,36,70,1) 100%)",
        height: "100vh",
        width: "100%",
        color: "white",
      }}
    >
      <Box sx={{ px: 8, pt: 10 }}>
        <Typography
          sx={{
            fontSize: "64px",
            fontWeight: "700",
            fontFamily: "Hahmlet",
            color: "white",
          }}
        >
          Welcome to Single Chance
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography sx={{ color: "white", fontSize: "20px" }}>
            Host ID : SC101
          </Typography>
          {/* <GameButton onClick={logcook} sx={{ fontSize: "14px", px: 2 }}>
            HOST NAME
          </GameButton> */}
        </Box>

        <Box
          sx={{
            p: "2px",
            width: 500,
            borderRadius: "24px",
            background: "rgb(255,229,157)",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,229,157,1) 0%, rgba(255,187,0,1) 100%)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#292A59",
              borderRadius: "24px",

              p: 2,
              py: 6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <InputBase
                placeholder="Login"
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                sx={{
                  backgroundColor: "#3D3F85",
                  fontSize: "20px",
                  borderRadius: "16px",
                  color: "white",
                  p: 1,
                  width: "100%",
                  "& .MuiInputBase-input::placeholder": {
                    color: "white",
                    opacity: 1,
                  },
                }}
              />
              <Box
                sx={{
                  backgroundColor: "#3D3F85",
                  borderRadius: "16px",
                  width: "100%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .MuiInputBase-input::placeholder": {
                    color: "white",
                    opacity: 1,
                  },
                }}
              >
                <InputBase
                  value={formData.password}
                  type={isShowPassword ? "text" : "password"}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Password"
                  sx={{
                    fontSize: "20px",
                    color: "white",
                    width: "100%",
                  }}
                />
                <IconButton onClick={() => setIsShowPassword(!isShowPassword)}>
                  <Visbility />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GameButton
                disabled={isLoading}
                sx={{
                  boxShadow: 4,
                  fontSize: "14px",
                  px: 4,
                  textTransform: "none",
                }}
                onClick={(e) => submitForm(e)}
              >
                Login
              </GameButton>

              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  textTransform: "none",
                  borderColor: "white",
                  width: "109px",
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "transparent",
                  },
                }}
                onClick={handleClose}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <img
        style={{ position: "absolute", top: 0, right: 0, height: "100vh" }}
        src={SpinnerSound}
        alt=""
      />
    </Box>
  );
}

export default Login;
