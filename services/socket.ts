import io from "socket.io-client";

const socketClient = io(`https://new-api.realm.chat`);

export default socketClient;