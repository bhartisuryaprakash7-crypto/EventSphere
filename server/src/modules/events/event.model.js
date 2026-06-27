const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    venue: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    tags: [String],

    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    status: {
        type: String,
        enum: ["pending","approved","rejected"],
        default: "pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);