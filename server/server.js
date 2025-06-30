const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3030;

// Раздача статики фронта
app.use(express.static(path.join(__dirname, '../dist')));

// Для SPA: отдаём index.html на все не-API запросы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 