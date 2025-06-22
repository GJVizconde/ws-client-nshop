import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

const apiUrl = import.meta.env.VITE_API_URL;

export const connectToServer = (token: string) => {
  console.log({ apiUrl });

  const manager = new Manager(`${apiUrl}/socket.io/socket.io.js`, {
    extraHeaders: {
      hola: 'mundo',
      authentication: token
    }
  });

  // Crear el Manager SIN auth
  // const manager = new Manager('https://nest-shop-zfsc.onrender.com', {
  //   transports: ['websocket']
  // });

  socket?.removeAllListeners();

  socket = manager.socket('/');

  // socket = manager.socket('/', {
  //   auth: {
  //     token
  //   }
  // });
  addListerners();
};

const addListerners = () => {
  const clientUl = document.querySelector('#clients-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  const serverStatusLabel = document.querySelector('#server-status')!;

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'connected';
  });

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'disconnected';
  });

  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';
    clients.forEach((clientId) => {
      clientsHtml += `
      <li>${clientId}</li>
      `;
    });
    clientUl.innerHTML = clientsHtml;
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit('message-from-client', {
      id: 'YO!!',
      message: messageInput.value
    });

    messageInput.value = '';
  });

  socket.on('message-from-server', (payload: { fullName: string; message: string }) => {
    const li = document.createElement('li');
    li.innerHTML = `
  <strong>${payload.fullName}</strong>
  <span>${payload.message}</span>
`;
    messagesUl.append(li);
  });
};
