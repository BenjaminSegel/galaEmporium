import mongoose from "mongoose"
import crypto from "crypto"

// borde alla crypto saker ligga i en egen fil?
const salt = "örtSalt"
const getHash = (password) => {
  let hash = crypto.pbkdf2Sync(
    password, salt, 1000, 64, 'sha512'
    ).toString('hex')
  return hash 
}
// ---------------------------------

// borde alla schemas ligga i egna filer i en 'models' mapp?
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password_hash: String,
  club_id:  [{type: mongoose.Schema.Types.ObjectId, ref: "clubs"}]
})
// ---------------------------------

const userModel = mongoose.model('users', userSchema)

export default function user(server) {

  server.get('/api/user', async (req, res) => {
    res.json(await userModel.find())
  })

  server.post('/api/user', async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
          message: "Missing required fields"
        })
      }

      const newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password_hash: getHash(req.body.password),
        club_id: req.body.club_id
      })

      const savedUser = await newUser.save()
      res.status(201).json({ user_id: savedUser._id })

    } catch (error) {
      res.status(500).json({
        message: "Error creating new user",
        error: error 
      })
    }
  })
}