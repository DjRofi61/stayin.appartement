const express = require('express')


//socket io
const app = express();

server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

server.listen(8800)

 // Evnets //


 var events = require("./Events/events.js");
var eventBus = require("./Events/eventBus.js");

///////////////////socket test ///////////////
io.on('connection', (socket) => {
  console.log("socket id: " + socket.id);

  socket.on('userId', (data) => {
    console.log("userId "+ data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});




  ///////////////////////////////////////////////// add new user /////////////////

  let onlineUsers= [];
  const addNewUser = (idUser, socketId) =>{
   !onlineUsers.some((user) => user.idUser=== idUser) && onlineUsers.push({idUser, socketId})
  };
  //////////////////////////////////////////remove user////////////////////////////
 const removeUser= (socketId)=>{
   onlineUsers= onlineUsers.filter((user) => user.socketId !== socketId);
 
 }
 
 ///////////////////////////////get user/////////////////////////////////////////
 const getUser =((id)=>{
   return onlineUsers.find((user) => user.id== id)
 
 })

///////////////////////////////////connect + test event/////////////////////////
io.on("connection", (socket) => {
//  io.emit("TestEvent","first socket")

/////////////////////////////////////////////////add neww user/////////////// 
 socket.on("AddNewUser", (idUser) =>{
  addNewUser(idUser, socket.id)
}) 

  
//disconnect
 socket.on("disconnected", ()=>{
  console.log('socket disconnected')
 })
  }); 





const mongoose = require("mongoose");
require('dotenv').config();
const imageDownloader = require('image-downloader');
const Place = require('./modeles/AppartementModel.js');
const cors = require('cors') //permet la comminucation  entre les deux addr du front et back
const FeedBack= require ('./modeles/FeedBack.js')



app.use('/uploads', express.static(__dirname + '/uploads'));




app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));



function NewGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}



app.use(express.json())
mongoose.connect(process.env.MONGO_URL);
const db = mongoose.connection;
db.on('connected', () => {
  console.log('database connected')
  console.log(process.env.MONGO_URL)
  
})

app.get('/test', (req, res) => {
  res.send('hi')
  //afficher tous les appartements
  app.post("/appartement", (req, res) => {
    const appartement = {}
  })
})

app.post('/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  console.log("bdd connected")
  const {owner,
    title,wilaya,comun,street, addedPhotos, description,
    perks,apartementType, extraInfo, checkIn, checkOut, maxGuests,price
  } = req.body;
 
    const placeDoc = await Place.create({
      owner,
      title,wilaya,comun,street, photos: addedPhotos, description,
      perks, apartementType ,extraInfo, checkIn, checkOut, maxGuests,price,somme: 0
    });
  console.log (placeDoc)
      res.json(placeDoc); 

      console.log(placeDoc) 
      const reservedDates=placeDoc.reservedDates;
      console.log(reservedDates)
      const _id=placeDoc.id;
      const photos=placeDoc.photos;
      console.log(_id)
     await eventBus.Publish(new events.AppartementCreatedEvent(
        NewGUID(),(new Date()).toISOString(), _id,owner,
        title,wilaya,comun,street, photos, description, perks,apartementType,
        extraInfo,  checkIn, checkOut, maxGuests,price, reservedDates
      
        )
      )
 
  
})


app.get('/places/all', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.get('/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  console.log(id)
  res.json(await Place.findById(id))
})


///////////////////////get user places/////////////////////////// 


app.get('/user-places/:owner', async (req, res) => {

  const  owner  = req.params.owner;
  console.log(typeof( owner))

  mongoose.connect(process.env.MONGO_URL);
  const placesOwner= await Place.find({owner : owner })
  const sum = placesOwner.reduce((accumulator, place) => accumulator + place.somme, 0);
  res.json({ places: placesOwner, sum });

});

////////////////////////////////update appartement/////////////////////////////

app.put('/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  
  const {
    id, owner,title,wilaya,comun,street,addedPhotos,description,
    perks,extraInfo,apartementType,checkIn,checkOut,maxGuests,price,
  } = req.body;
  
    const placeDoc = await Place.findById(id);
     placeDoc.set({
      owner,
      title,wilaya,comun,street, photos: addedPhotos, description,
      perks,extraInfo, apartementType , checkIn, checkOut, maxGuests,price
      });
      await placeDoc.save();
      res.json('ok');

          /****publish appartement updated event****/


          const _id=placeDoc.id;
          const photos=placeDoc.photos;
          const reservedDates=placeDoc.reservedDates;
          await eventBus.Publish(new events.AppartementUpdatedEvent(
            NewGUID(),(new Date()).toISOString(), _id,owner,
            title,wilaya,comun,street, photos, description, perks,apartementType,
            extraInfo,  checkIn, checkOut, maxGuests,price, reservedDates
          
            )
          )

    })
 

    ///////////////////////////////deleeteee appartementttttttttt/////////////////////////

     app.delete('/places/:id', async (req, res) => {
      mongoose.connect(process.env.MONGO_URL);
      const { id } = req.params;
      console.log(id)
      res.json(await Place.findOneAndDelete({_id: id}))
         
        /**************publish appartement deleted event ***********/
        await eventBus.Publish(new events.AppartementDeletedEvent(
          NewGUID(),(new Date()).toISOString(), id ) )


    }) 
//////////////////////////// add feedBack ////////////////////

app.post('/feedBack', async(req, res)=>{
  mongoose.connect(process.env.MONGO_URL);
  
  const id =  req.body.id;
  const user = req.body.user;
  const feedBack = req.body.feedBack;
  console.log(req.body)

 const fb = await FeedBack.create({
  id, user, feedBack });

      res.json(fb); 
      console.log (fb) 
      FeedBack.fi
})
 
////////////////// get feedBack by id ///////////////
app.get('/feedBack/:id', async(req,res) =>{
  const id = req.params.id
 console.log (typeof(id))
  mongoose.connect(process.env.MONGO_URL);
res.json( await  FeedBack.find({id : id}))
})



  ///////////////////////consume new events//////////////////////////////

  async function ReadNewEvents() {
    var newEvents =await eventBus.GetNewEvents();
    console.log(newEvents)
    
    for (let i = 0; i < newEvents.length; i++) {
        const message = newEvents[i];
        console.log(message)
     /*  if(message.Type == "UserCreatedEvent")
        db.InsertUser(message.body); */
        if(message.Type == "ReservationCreatedEvent"){
          console.log(message.body.price)
          console.log(message.body.appartement)
        const sommeAppartement = await Place.findByIdAndUpdate(message.body.appartement,  { $inc: { somme: message.body.price } },{ new: true }); 
         console.log( "sooooooooommmmmmmee" + sommeAppartement)
        

        




       /*  eventBus.Publish(new events.AppartementUpdatedEvent( NewGUID(),(new Date()).toISOString(),
          message.body.appartement,  message.body.reservedDates)) */
      
      }

      
    } 
}


setInterval(ReadNewEvents, 5000);


//app.listen(8800)