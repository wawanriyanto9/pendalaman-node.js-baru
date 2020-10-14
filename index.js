import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import hbs from 'hbs'
import path from 'path'
import morgan from 'morgan'
import bodyPraser from 'body-parser' // import bodyparser biar bisa post
import fileUpload from 'express-fileupload'
import fs from 'fs'

// impor database ke index
import { InitDatabase, initTable, insertmember, getmember } from './database.js'
import { compileFunction } from 'vm'


const __dirname = path.resolve()

const app = express()
const dbmember = InitDatabase()
initTable(dbmember)

app.set('views', __dirname + '/pages')
app.set('view engine', 'html')
app.engine('html', hbs.__express)

//file parser buat upload
app.use(fileUpload())

// buat baca log incoming request
app.use(morgan('combined'))

// method parse buat post 
app.use(bodyPraser.urlencoded())

// ambil file dengan path static
app.use('/assets', express.static(__dirname + '/assets'))
    // 1 lagi buat folder photo
app.use('/files', express.static(__dirname + '/files'))

app.get('/', (req, res, next) => {
    res.send({ success: true })
})

// ambil halaman anggota
app.get('/member', async(req, res, next) => {
    let members
    try {
        members = await getmember(dbmember)
    } catch (error) {
        return next(error)

    }
    res.render('member', { members })
})

//code buat handle  Get Method
app.get('/add-member', (req, res, next) => {
    res.send(req.query)
})

//code buat handle  post Method
app.post('/add-member', (req, res, next) => {
    console.log('Request', req.body)
    console.log('File', req.files)


    //ambil file name
    const fileName = Date.now() + req.files.photo.name

    //tulis file
    fs.writeFile(path.join(__dirname, '/files/', fileName), req.files.photo.data, (err) => {
        if (err) {
            console.error(err)
            return
        }

        // insert member
        insertmember(dbmember, req.body.name, parseInt(req.body.age), `/files/${fileName}`)

        // redirect refresh
        res.redirect('/member')

    })


})

app.use((err, req, res, next) => {
    res.send(err.message)
})

app.listen(process.env.PORT, () => {
    console.log(`App listen on port ${process.env.PORT}`)
})