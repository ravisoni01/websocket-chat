import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

const NameModal = ({ username, setUsername }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setUsername(name);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          width: 400,
        },
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={!username}
    >
      <Typography variant="h6" fontWeight={600}>
        Enter your name
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            sx={{ my: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default NameModal;
