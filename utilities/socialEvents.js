
const users = [];

 // add user with socketId method
 const addUser = async (userId, socketId) => {
   const user = users.find(user => user.userId === userId);
      // check if user already in array of users
   if (user && user.socketId === socketId) {
     return users;
   }
   
    // remove user if not equal to socketId,
    // making sure no duplicate users
   else {
     if (user && user.socketId !== socketId) {
       await removeUser(user.socketId);
     }
     // create new user
     const newUser = { userId, socketId };

     users.push(newUser);

     return users;
   }
 };


 // method to remove user 
 const removeUser = async socketId => {
   const indexOf = users.map(user => user.socketId).indexOf(socketId);

   await users.splice(indexOf, 1);

   return;
 };

 const findConnectedUser = userId => users.find(user => user.userId === userId);

 module.exports = { addUser, removeUser, findConnectedUser };
