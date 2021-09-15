import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Client } from 'tmi.js';

import connection from './connection';
import { upload } from './middlewares/upload';

// server config
const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);
const socketIo = new Server(server, {
  cors: {
    origin: '*',
  }
});



// functions
let listeningForVotes = false;
const users = {};
let results = [];
let count = 0;

const addOption = (data) => {
  let temp = results.find(e => e.title === data.title);

  if(temp)
    return;

  results.push({
    title: data.title,
    votes: 0
  });
}

const deleteOption = (title: String) => {
  results = results.filter(option => {
    return option.title !== title;
  })

  return results;
}

const voteTo = (title: String) => {
  if(listeningForVotes == false)
    return;
  
  let temp = results.find(e => e.title === title);

  if (temp) {
    temp.votes++;
    socketIo.sockets.emit('Add', results);
    // socketIo.sockets.emit('nVotes', ++count);
  }

}
const changeListeningToVotes = (status: boolean) => {
  listeningForVotes = status;
  socketIo.sockets.emit('ListeningToVotes', status);
}

// routes
app.get('/', (req, res) => {
  let temp = 0;
  results.forEach(element => {
    temp += element.votes;
  });

  res.json({
    results,
    nVotes: temp ? temp : 0
  });
})

app.post('/add', (req, res) => {
  const { title } = req.body;

  addOption({
    title
  });
  
  res.json(results);
})

app.delete('/delete/:title', (req, res) => {
  const { title } = req.params;
  
  deleteOption(title);
  res.json(results);
})

app.get('/reset', (req, res) => {
  results.forEach( element => {
    element.votes = 0;
  })
  count = 0;

  res.json({
    results,
    nVotes: 0
  });
})

app.get('/vote/:title', (req, res) => {
  const { title } = req.params;
  voteTo(title);

  res.json(results);
})

app.get('/comecar-votacao', (req, res) => {
  changeListeningToVotes(true);
  res.json({listeningForVotes});
})
app.get('/encerrar-votacao', (req, res) => {
  changeListeningToVotes(false);
  res.json({listeningForVotes});
})

app.post("/changeImage/:title", upload.single("file"), (req, res) => {
  const { title } = req.params;
  const file : any = req.file;

  let temp = results.find(e => e.title === title);

  if (temp) {
    temp.imageUrl = file.location;
    socketIo.sockets.emit('Add', results);
  }

  socketIo.emit('Add', results);
  res.json(results);
});


dotenv.config({
  path: '.env'
})

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const channel = 'enriqut';

const options = {
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  channels: [ channel ],
  // identity: {
  //   username: process.env.ACCOUNT_USERNAME,
  //   password: process.env.ACCOUNT_PASSWORD
  // }
}


const commands = {
  cospobre: {
    response: 'Os votos serão contabilizadas a partir de agora!! Votos anteriores ou depois da organização fechar não serão contados.'
  }
}

const client = new Client(options);

client.connect();


// commands
client.on('chat', (channel, userstate, message, self) => {
  const { username } = userstate;
  
  const isBot = username.toLowerCase() === process.env.ACCOUNT_USERNAME;

  if (self)
    return;
  
  if (message[0] != '!')
    return;
  
  const [ command, commandOption] = message.split(" ", 2);
  // const [raw, command, argument] = message.match(regexpCommand);


  // admin commands
  if(self) {
    if (command === '!comecar-votacao') { 
      listeningForVotes = true;
    } else if (command === '!encerrar-votacao') {
      listeningForVotes = false;
    } else if (command === '!resetar-votacao') {
      Object.keys(results).map( (title) => {
        results[title] = 0;
      });
    }
  }
  
  // public commands
  else if (command === '!vote') {
    // check if user has already voted
    if(users[username])
      return;
    
    // register vote
    results[commandOption]++;
    
    // register user
    users[username] = true;
  }
  
  else if (command === '!cospobre') {
    client.say(channel, `Command ${command} found with ${commandOption}`);
  }

  else {
    client.say(channel, `Commando não encontrado`);
  }
  
});

// socketIo
socketIo.on('connection', socket => {
  console.log(`Socket conectado ${socket.id}`);
  
  socket.on('Add', (data) => {
    console.log("adding");
    addOption(data)
    socketIo.emit('Add', results);
  });

  // socket.on('nVotes', (data) => {
  //   socketIo.emit('nVotes', count);
  // });

  socket.on("Delete", (title) => {
    console.log("Deletando");
    deleteOption(title);
    socketIo.sockets.emit('Add', results);
  })

  // socket.on("ListeningToVotes", () => {
  //   changeListeningToVotes(!listeningForVotes);
  //   socketIo.sockets.emit('ListeningToVotes', listeningForVotes);
  // })
})

server.listen(3333);
