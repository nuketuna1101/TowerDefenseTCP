const updateBaseHpHandler = ({ socket, userId, payload }) => {
    try {

      socket.write(packet);
    } catch (error) {
      handleError(socket, error);
    }
  };
  
  export default updateBaseHpHandler;
  