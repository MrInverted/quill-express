import { Server } from "socket.io";
import mongoose from "mongoose";
import { createOrReturn, saveDocument } from "./models";

const io = new Server({
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {

  socket.on("change-room", async (id) => {
    socket.join(id);

    socket.rooms.forEach((room) => {
      if (room === id) return;
      if (room === socket.id) return;
      socket.leave(room);
    });

    socket.emit("success", `Room id: ${id}`);

    try {
      const document = await createOrReturn(id);
      socket.emit("load-document-from-server", document?.data);
    } catch (error) {
      socket.emit("error", "Document receiving error...");
    }
  })

  socket.on("changes-from-client", (data) => {
    socket.broadcast.emit("changes-from-server", data);
  })

  socket.on("save-document", async (id, data) => {
    try {
      const savedDocument = await saveDocument(id, data);
      socket.emit("success", "Document was saved");
    } catch (error) {
      socket.emit("error", "Document saving error...");
    }
  })
});

mongoose.connect('mongodb://127.0.0.1:27017/docs')
  .then(() => console.log('Connected!'))
  .then(() => io.listen(3000));
