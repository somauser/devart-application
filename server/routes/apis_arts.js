const express = require('express');
const router = express.Router();

router.get('/', async(req, res)=>{
    res.json({
        status: 200,
        message: 'Hello from api'
    })
})

module.exports = router;