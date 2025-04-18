# README

## Peer-To-Playlist

## Shahir Ahmed and Megan Triplett
More details in our [technical report](https://github.com/Shahir-47/Peer-to-Playlist/blob/development/Shahir%20and%20Megan%20Technical%20Report.pdf).

## Running Client Side on the Web:

The live deployment of our application:  

https://peer-to-playlist.onrender.com/auth  

## Installing Locally
in the `./Peer-to-Playlist` directory run:

```bash
npm install  

npm run dev 
```
In another terminal, run in the `./Peer-to-Playlist/client` directory 
```bash
npm install 

npm run dev 
```
## Initializing the Database
Create an account and a database at [MongoDb](mongodb.com) and put the url into the .env file below
Similarly, do the same for Cloudinary, with the addition of the API Key and the API Secret.

## Setting up the .env file

```
PORT=5000

MONGO_URI=\<your_mongo_uri>

JWT_SECRET=\<your_very_strong_secret>

NODE_ENV=development

CLIENT_URL=http://localhost:5173

CLOUDINARY_API_KEY=\<your_cloudinary_api_key>

CLOUDINARY_API_SECRET=\<your_cloudinary_api_secret>

CLOUDINARY_CLOUD_NAME=\<your_cloudinary_cloud_name>
```
## File directory

Directory structure:

```
└── \<your name>-peer-to-playlist/
    ├── README.md
    ├── LICENSE
    ├── package.json
    ├── api/
    │   ├── server.js
    │   ├── config/
    │   │   ├── cloudinary.js
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── matchController.js
    │   │   ├── messageController.js
    │   │   └── userController.js
    │   ├── middleware/
    │   │   └── auth.js
    │   ├── models/
    │   │   ├── Message.js
    │   │   └── User.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── matchRoutes.js
    │   │   ├── messageRoutes.js
    │   │   └── userRoutes.js
    │   ├── seeds/
    │   │   └── user.js
    │   └── socket/
    │       └── socket.server.js
    └── client/  
        ├── README.md
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── vite.config.js
        ├── .gitignore
        ├── public/
        │   ├── female/
        │   └── male/
        └── src/
            ├── App.jsx
            ├── index.css
            ├── main.jsx
            ├── components/
            │   ├── Header.jsx
            │   ├── LoginForm.jsx
            │   ├── MessageInput.jsx
            │   ├── Sidebar.jsx
            │   ├── SignUpForm.jsx
            │   ├── SwipeArea.jsx
            │   └── SwipeFeedback.jsx
            ├── lib/
            │   └── axios.js
            ├── pages/
            │   ├── AuthPage.jsx
            │   ├── ChatPage.jsx
            │   ├── HomePage.jsx
            │   └── ProfilePage.jsx
            ├── socket/
            │   └── socket.client.js
            └── store/
                ├── useAuthStore.js
                ├── useMatchStore.js
                ├── useMessageStore.js
                └── useUserStore.js

```
