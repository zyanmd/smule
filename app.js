const express = require('express');
const path = require('path');
const smuledl = require('./smuledl'); // Your scraper module

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for Vercel deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Smule Downloader',
    result: null,
    error: null
  });
});

app.post('/download', async (req, res) => {
  try {
    const { url } = req.body;
    const result = await smuledl(url);
    
    if (result.status) {
      res.render('index', { 
        title: 'Smule Downloader - Hasil',
        result: result,
        error: null
      });
    } else {
      res.render('index', { 
        title: 'Smule Downloader - Error',
        result: null,
        error: result.msg
      });
    }
  } catch (error) {
    res.render('index', { 
      title: 'Smule Downloader - Error',
      result: null,
      error: 'Terjadi kesalahan pada server'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;