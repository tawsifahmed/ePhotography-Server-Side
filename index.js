const express = require('express');
const app = express();
const port = process.env.PORT || 1000;


app.get('/', (req, res) => {
    res.send('a11 server running')
})

app.listen(port, () => {
    console.log(`a11 sever running on port ${port}`);
})