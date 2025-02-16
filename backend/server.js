// import app from "./app.js";
// import cloudinary from "cloudinary";
// import { log } from "console";
// import http from "http";
// import { Server } from "socket.io";

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// // ================================================
// //            Chat Server                        //
// // ================================================
// // Create HTTP server and attach Socket.io
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// }); //  Socket.io initialization

// // Socket.io event handling
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("chat", (data) => {
//     io.emit("chat", data); // Broadcast to all connected clients
//     console.log(data);
//   });

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });
// // ================================================
// //            Chat Server                        //
// // ================================================
// export const serverConnection = () => {
//   const PORT = process.env.PORT || 5000;
//   server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//   });
// };
import app from "./app.js";
import cloudinary from "cloudinary";
import { log } from "console";
import http from "http";
import { Server } from "socket.io";
import { Chat } from "./models/chatSchema.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = {}; // Store users' socket ids by their user ID

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("set_user", (userId) => {
    if (!userId) {
      console.error("User ID is required");
      return;
    }
    users[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver, content } = data;

    if (!sender || !receiver || !content) {
      console.error("Sender, receiver, and content are required");
      return;
    }

    try {
      let chat = await Chat.findOne({
        $or: [
          { patientId: sender, doctorId: receiver },
          { patientId: receiver, doctorId: sender },
        ],
      });

      if (!chat) {
        chat = new Chat({
          patientId: sender,
          doctorId: receiver,
          messages: [],
        });
      }

      chat.messages.push({ sender, content, createdAt: new Date() });
      await chat.save();

      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", data);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        console.log(`User ${userId} disconnected`);
        delete users[userId];
        break;
      }
    }
  });
});

export const serverConnection = () => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};
