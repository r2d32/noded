var FriendRequest = new mongoose.Schema({
    fromUser: mongoose.Schema.Types.ObjectId,
    toUser:mongoose.Schema.Types.ObjectId,
    accepted: Boolean,
});
