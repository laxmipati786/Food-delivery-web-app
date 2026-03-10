# Modern Food Delivery App (Swiggy / Zomato Clone)

This is a full-stack, production-ready modern food delivery web application built with the MERN stack.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (v3), Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Features Included
1. **Landing Page**: Modern hero section, search bar, restaurant listing.
2. **Restaurant Page**: Specific restaurant's menu with veg/non-veg tags, ratings, and smooth animations.
3. **Cart System**: Add to cart, live global state using React Context, price calculation, and delivery fees.
4. **Checkout**: Address capture and final order summary.
5. **Authentication**: Fully functional Login and Signup pages and protected endpoints.
6. **User Dashboard**: Shows recent orders and delivery status.
7. **Production Quality**: Modular folder structure, error handling, clean UI (Tailwind + Framer Motion).

## Folder Structure
```text
x/
├── client/          (React Frontend)
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── tailwind.config.js
└── server/          (Node/Express Backend)
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── server.js
    └── seeder.js
```

## How to Run
Both the client and the server are currently running locally on your machine on ports 5173 and 5000 respectively. You can visit the frontend at `http://localhost:5173`.
