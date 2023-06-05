const mongoose = require("mongoose");

const connectionString = "mongodb+srv://rofi:$zohalsadim$@cluster0.9eqmthu.mongodb.net/ms-appartement";
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
