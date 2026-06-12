import 'dotenv/config'
import connectDB from './src/config/db.js';
import app from './src/app.js'

const PORT = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server is listening on http://localhost:${PORT}`);
        })
    }).catch((error)=>{
        console.error("Error During DB connection",error.message);
    })