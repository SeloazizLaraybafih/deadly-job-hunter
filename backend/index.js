require('dotenv').config()
const express = require('express')
const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://sirjobsir.ac.id',
      'https://www.sirjobsir.ac.id',
    ],
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Archive not responding' })
    }
    res.json({ message: 'Archive connected 🏛️' })
  })
})

//CREATE USER
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `

    db.query(sql, [email, passwordHash], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res
            .status(409)
            .json({ message: 'Email already registered', error: err.message })
        }
        return res
          .status(500)
          .json({ message: 'Failed to register user', error: err.message })
      }

      res.status(201).json({
        message: 'Citizen registered',
        user_id: result.insertId,
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Encryption failed', error: err.message })
  }
})

//LOGIN USER
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  const sql = 'SELECT * FROM users WHERE email = ?'

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Database error', error: err.message })
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials', error: err.message })
    }

    const user = results[0]

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials', error: err.message })
    }

    //Create token
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    )

    res.json({
      message: 'Login successful',
      token,
    })
  })
})

//AUTH MIDDLEWARE
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Token missing' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' })
    req.user = user
    next()
  })
}

// GET /me INFO
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    id: req.user.user_id,
    email: req.user.email,
  })
})

// GET ALL APPLICATIONS FOR THE LOGGED-IN USER
app.get('/api/applications', authenticateToken, (req, res) => {
  const userId = req.user.user_id

  const sql = 'SELECT * FROM applications WHERE user_id = ?'

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Failed to fetch applications', error: err.message })
    }

    res.json({
      applications: results,
    })
  })
})

// POST NEW APPLICATION
app.post('/api/applications', authenticateToken, (req, res) => {
  const userId = req.user.user_id
  const { company_name, position, status, notes } = req.body

  if (!company_name || !position || !status) {
    return res.status(400).json({
      message: 'Company, position, and status are required',
      error: err.message,
    })
  }
  const applied_date = new Date().toISOString().split('T')[0]

  const sql = `
    INSERT INTO applications (user_id, company_name, position, status, applied_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [userId, company_name, position, status, applied_date, notes || ''],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Failed to create application', error: err.message })
      }

      res.status(201).json({
        message: 'Application added successfully',
        id: result.insertId,
        company_name,
        position,
        status,
        applied_date: new Date().toISOString(),
        notes,
      })
    }
  )
})

// UPDATE APPLICATION
app.put('/api/applications/:id', authenticateToken, (req, res) => {
  const userId = req.user.user_id
  const applicationId = req.params.id
  const { company_name, position, status, notes } = req.body

  if (!company_name || !position || !status) {
    return res.status(400).json({
      message: 'Company, position, and status are required',
      error: err.message,
    })
  }

  const sql = `
    UPDATE applications
    SET company_name = ?, position = ?, status = ?, notes = ?
    WHERE id = ? AND user_id = ?
  `

  db.query(
    sql,
    [company_name, position, status, notes || '', applicationId, userId],
    (err, result) => {
      if (err) {
        console.log('SQL ERROR:', err)
        return res
          .status(500)
          .json({ message: 'Failed to update application', error: err.message })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Application not found or not yours',
          error: err.message,
        })
      }

      res.json({
        message: 'Application updated successfully',
        id: Number(req.params.id),
        company_name,
        position,
        status,
        applied_date: new Date().toISOString(),
        notes,
      })
    }
  )
})

// DELETE APPLICATION
app.delete('/api/applications/:id', authenticateToken, (req, res) => {
  const userId = req.user.user_id
  const applicationId = req.params.id

  const sql = 'DELETE FROM applications WHERE id = ? AND user_id = ?'

  db.query(sql, [applicationId, userId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Failed to delete application', error: err.message })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Application not found or not yours',
        error: err.message,
      })
    }

    res.json({
      message: 'Application deleted successfully',
      error: err.message,
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
