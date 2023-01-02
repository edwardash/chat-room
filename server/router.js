import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send("server running");
});


export default router;