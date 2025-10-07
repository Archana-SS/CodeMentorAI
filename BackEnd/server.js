require('dotenv').config()

const app=require('./src/app')

app.listen(4000, () => { 
    console.log('Server is running on port http://localhost:4000')
})