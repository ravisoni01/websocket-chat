import { Box, Button, TextField, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import NameModal from "./NameModal";
import { db } from "../firebase/config";
import { addDoc, collection, getDocs } from "firebase/firestore";

const socket = io("http://localhost:5000");

function ChatRoom() {
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Save data in firebase
  const handleSaveData = async (data) => {
    // fetch("https://chat-app-5fd64-default-rtdb.firebaseio.com/messages.json", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    try {
      const docRef = await addDoc(collection(db, "messages"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Invoke the socket when new message come
  useEffect(() => {
    socket.on("receive_message", (e) => {
      const data = JSON.parse(e);

      const lastMessage = chatMessages.length
        ? chatMessages[chatMessages.length - 1]
        : null;
      if (
        !(
          lastMessage?.message === data.message &&
          lastMessage?.createdDate === data.createdDate
        )
      ) {
        setChatMessages((prev) => [...prev, data]);
      }
    });
  }, []);

  // Send Message function
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    const data = { username, message, createdDate: new Date() };
    socket.emit("send_message", JSON.stringify(data));

    handleSaveData(data);
    setMessage("");
  };

  // Fetch All Messages from firebase
  const fetchAllMessages = async () => {
    await getDocs(collection(db, "messages")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => doc.data());
      console.log(newData);
    });
  };

  useEffect(() => {
    fetchAllMessages();
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NameModal username={username} setUsername={setUsername} />

      <Box
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          height: "80vh",
          width: 500,
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "space-between",
        }}
      >
        <Box sx={{ height: "100%" }}>
          <Typography sx={{ fontWeight: 600 }} variant="h6">
            Welcome {username}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
              overflowY: "auto",
              height: "55vh",
            }}
          >
            {chatMessages?.map(
              ({ username: otherUsername, message, createdDate }, index) => {
                const self = otherUsername === username;

                return (
                  <Box
                    key={username + index}
                    sx={{
                      alignSelf: self ? "flex-end" : "flex-start",
                      maxWidth: "50%",
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      fontSize={11}
                      sx={{
                        textAlign: self ? "right" : "left",
                      }}
                    >
                      {otherUsername}
                    </Typography>
                    <Typography
                      sx={{
                        backgroundColor: self
                          ? "primary.light"
                          : "rgba(0,0,0,0.4)",
                        borderRadius: 1,
                        color: "white",
                        px: 1,
                      }}
                    >
                      {message}
                    </Typography>

                    <Typography
                      fontSize={11}
                      sx={{
                        textAlign: self ? "right" : "left",
                      }}
                      px={1}
                    >
                      {moment(createdDate).format("hh:mm a")}
                    </Typography>
                  </Box>
                );
              }
            )}
          </Box>
        </Box>
        <form onSubmit={sendMessage}>
          <Box>
            <TextField
              autoFocus
              placeholder="Type your message..."
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={(theme) => ({
                borderRadius: theme.shape.borderRadius,
              })}
            />
          </Box>
          <Box sx={{ width: "80%", margin: "auto", mt: 2 }}>
            <Button type="submit" variant="contained" sx={{ width: "100%" }}>
              Send
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default ChatRoom;
