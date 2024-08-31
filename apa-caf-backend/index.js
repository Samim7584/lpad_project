const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const secretKey = 'Samim7584SecretKey';

const app = express();
app.use(bodyParser.json());
app.use(cors());


function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Assuming 'Bearer [token]' format
  if (token) {
      jwt.verify(token, secretKey, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }
          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
}

// MSSQL Database Configuration
const dbConfig = {
    user: 'Samim7584',
    password: 'Mondal7584',
    server: 'samimserverlpad.database.windows.net',
    database: 'caf_database',
    options: {
        encrypt: true, // for Azure use true
    }
};

// Connect to MSSQL Database
mssql.connect(dbConfig).then(pool => {
    if (pool.connected) console.log('Connected to MSSQL');
    global.connectionPool = pool;
}).catch(err => console.error('Database Connection Failed:', err));

// Routes
app.post('/api/signup', async (req, res) => {
  const { email, empcode, name, password, territory } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connectionPool.request()
          .input('email', mssql.VarChar, email)
          .input('empcode', mssql.VarChar, empcode)
          .input('name', mssql.VarChar, name)
          .input('password', mssql.VarChar, hashedPassword)
          .input('territory', mssql.VarChar, territory)
          .query('INSERT INTO Users (email, empcode, name, password, territory) VALUES (@Email, @Empcode, @Name, @Password, @Territory)');
      res.status(200).send({ message: 'User signed up successfully' });
  } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).send({ error: 'Signup failed' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      const userResult = await connectionPool.request()
          .input('email', mssql.VarChar, email)
          .query('SELECT * FROM Users WHERE email = @Email');

      if (userResult.recordset.length > 0) {
          const user = userResult.recordset[0];
          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if (isPasswordMatch) {
              // Generate a JWT
              const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

              let redirectTo = '/fund-requester';

              const territoryAdminResult = await connectionPool.request()
                  .input('email', mssql.VarChar, email)
                  .query('SELECT * FROM TerritoryAdmin WHERE email = @Email');

              if (territoryAdminResult.recordset.length > 0) {
                  redirectTo = '/territory-admin';
              }

              const cafAdminResult = await connectionPool.request()
                  .input('email', mssql.VarChar, email)
                  .query('SELECT * FROM CAFAdmin WHERE email = @Email');

              if (cafAdminResult.recordset.length > 0) {
                  redirectTo = '/caf-admin';
              }

              res.send({ token, redirectTo });
          } else {
              res.status(401).send({ error: 'Invalid credentials' });
          }
      } else {
          res.status(401).send({ error: 'Invalid credentials' });
      }
  } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send({ error: 'Login failed' });
  }
});

app.get('/api/fund-requester', authenticateJWT, (req, res) => {
  // Fund requester logic here
  res.send('Fund Requester Page');
});

app.get('/api/territory-admin', authenticateJWT, (req, res) => {
  // Territory admin logic here
  res.send('Territory Admin Page');
});

app.get('/api/caf-admin', authenticateJWT, (req, res) => {
  // CAF admin logic here
  res.send('CAF Admin Page');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
