import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";

import ModalBackground from "../../public/backgrounds/bgModal.png"

function StyledModal({ open, handleClose, children }) {
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
          width: "1299.08px",
          height: "615.79px",
          backgroundPosition: "center",
          boxShadow: 24,
          zIndex: 99999,
          //   bgcolor: "background.paper",
          //   border: "2px solid #000",
          //   p: 4,
          //   backgroundImage: "url('../backgrounds/bgModal.png')",
          //   backgroundRepeat: "no-repeat", 
          //   backgroundSize: "cover",

        }}
      >
        <img
          src={ModalBackground}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            px: "16px",
            py: 5,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
}

StyledModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node,
};
export default StyledModal;
