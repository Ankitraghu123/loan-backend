const dotenv = require('dotenv').config('./.env')
const express = require('express')
const dbConnect = require('./config/dbConnect')
dbConnect()
const { errorHandler, notFound } = require('./middlewares/errorHandler')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload');
const imagekit = require('./config/imageKit'); 

const AdminRouter = require('./routes/AdminRoute')
const LoanTypeRouter = require('./routes/LoanTypeRoutes')
const BusinessAssociatesRouter = require('./routes/BusinessAssociatesRoutes')
const LeadRouter = require('./routes/LeadRoutes')
const CallRouter = require('./routes/CallRoutes')
const MeetingRouter = require('./routes/MeetingRoutes')

//documents routes
const LoanDocRouter = require('./routes/LoanDocumentsRoute')



const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

app.use(fileUpload());
app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())


app.use('/api/admin',AdminRouter)
app.use('/api/loan',LoanTypeRouter)
app.use('/api/businessAssociates',BusinessAssociatesRouter)
app.use('/api/lead',LeadRouter)
app.use('/api/call',CallRouter)
app.use('/api/meeting',MeetingRouter)
app.use('/api/loanDoc',LoanDocRouter)

app.use(notFound)
app.use(errorHandler)


app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})