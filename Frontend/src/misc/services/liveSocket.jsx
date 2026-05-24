let socket;

const listeners = new Set();

export const connectLiveSocket = () => {
  if (
    socket &&
    (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    )
  ) {
    return;
  }

  socket = new WebSocket(
    "ws://localhost:8000/ws/live"
  );

  socket.onopen = () => {
    console.log(
      "✅ Live socket connected"
    );
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(
        event.data
      );

      listeners.forEach((cb) =>
        cb(data)
      );
    } catch (err) {
      console.error(err);
    }
  };

  socket.onerror = (err) => {
    console.error(
      "WebSocket error:",
      err
    );
  };

  socket.onclose = () => {
    console.log(
      "Socket disconnected"
    );
  };
};

export const subscribeToLiveEvents = (
  callback
) => {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
};