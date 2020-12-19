
const mongoose = require('mongoose');
const uri = process.env.MONGODB_CONNECT_URI;

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  chatsession: [{
    body: String,
    sender: String,
    imgUri: String,
    time: {
      hours: Number,
      minutes: Number
    }
  }]
});

async function connect() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

  console.log('connected');
}

async function retrieveChat() {
  await connect();
  const MyModel = mongoose.model('chat', chatSchema);
  let chatHistory = [];
  const docs = await MyModel.find({});
  //const docs = await MyModel.deleteMany({})  
  docs.forEach((doc) => {
    chatHistory = [...chatHistory, ...doc.chatsession]
  })
  console.log(chatHistory);
  return chatHistory;
}

async function saveChat(data) {
  await connect();
  const MyModel = mongoose.model('chat', chatSchema);
  const instance = new MyModel();

  instance.chatsession = data;
  instance.save(function (err) {
    if(err) {
      console.log('Error while saving data:', err);
      process.exit(1);
    }
    console.log('Saved');
  });

}

module.exports.saveChat = saveChat;
module.exports.retrieveChat = retrieveChat;
