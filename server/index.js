import 'dotenv/config'

import app from './src/app.js'

const PORT = process.env.PORT;

 app.listen(PORT, () => {
            console.log(`server is listening on http://localhost:${PORT}`);
  })