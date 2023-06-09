const mongoose = require("mongoose");
require('dotenv').config();
const connectionString = process.env.MONGO_URL
const eventTableName = "events"

const eventSchema = mongoose.Schema({
    EventId: String,
    PublishedTime: String
});

const Event = mongoose.model(eventTableName, eventSchema);


async function InsertEvent(newEvent) {
    await mongoose.connect(connectionString);

    var eve = new Event({ EventId: newEvent.EventId, PublishedTime: newEvent.PublishedTime });

    await eve.save();
}

async function GetAllEvents() {
    await mongoose.connect(connectionString);

    return await Event.find();
}


module.exports.GetAllEvents=GetAllEvents;
module.exports.InsertEvent=InsertEvent;
