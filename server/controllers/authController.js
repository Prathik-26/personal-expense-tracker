const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//register 
exports.registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: passwordHash
        });
        
        await user.save();

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server Error'});
    }
};


//login
exports.loginUser = async (req, res) => {
    try{
        const { email, password} = req.body;

        //find user
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: 'Invalid Credentials'});

        //compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid Credentials'});

        //token creation
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.json({
            user: {id: user._id, name: user.name, email: user.email},
            token
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error'})
    }
};