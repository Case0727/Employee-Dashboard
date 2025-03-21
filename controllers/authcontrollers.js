const User = require('../models/userSchema'); // UserModel
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const schema = require('../models/loginSchema');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = require('../index');

// Render Pages
const loadlogin = (req, res) => {
    res.render('login')
}

const loadlogout = (req, res) => {
    res.redirect('/login')
}

const loadsignup = (req, res) => {
    res.render('signup')
}

const dashboard = (req, res) => {
    res.render('dashboard')
}

const loadadd = async (req, res) => {
    res.render("add");
};

// POST: Add new user
const addUser = async (req, res) => {
    try {
        const { name, email, status } = req.body;
        const newUser = new User({ name, email, status });
        await newUser.save();
        console.log("User added successfully");
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding user");
    }
};

const loadedit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render('edit', { User: user });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error loading edit page");
    }
};

// Signup Logic
const signup = async (req, res) => {
    const data = req.body;
    console.log(data)
    const check = await schema.findOne({ email: data.email }) // Updated to findOne
    if (check) {
        return res.status(409).json({ message: "User Already Exists" });
    } else {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        console.log("hashed pass:", hashedPassword)
        console.log('UserID Received Data: ', data);
        try {
            const userId = new schema({
                _id: new mongoose.Types.ObjectId(),
                email: data.email,
                password: hashedPassword
            })
            await userId.save(); // Removed redundant save call
            console.log("User Created Successfully");
            res.redirect('/login')
            // return res.status(201).json({ message: "User Created Successfully" });
        } catch (err) {
            console.error(err); // Improved error logging
            return res.status(500).json({ message: "Error creating user" }); // Send error response
        }
    }
}

// Login Logic
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic email validation using regex
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: 'Invalid email format', success: false });
        }

        // Find user by email
        const user = await schema.findOne({ email: email });
        if (!user) {
            return res.status(409).json({ message: 'User does not exist', success: false });
        }

        // Compare entered password with stored hashed password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Auth Failed: email or password is wrong', success: false });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET || 'secret', // Use an environment variable for secret
            { expiresIn: '24h' }
        );

        // Now you can redirect to the dashboard after successful login
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

// DELETE LOGIC
const loaddelete = async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    console.log(req.params.id)
    console.log("User Deleted Successfully");
    res.redirect("/dashboard")
}

// UPDATE LOGIC
const loadupdate = async (req, res) => {
    try {
        const { name, email, status } = req.body;
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid User ID");
        }

        await User.findByIdAndUpdate(userId, { name, email, status }, { new: true });
        console.log(`User ${userId} updated successfully`);
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating user");
    }
};

// SEARCH API
const loadsearch = async (req, res) => {
    const searchQuery = req.query;
    console.log("Search Query:", searchQuery); // Log the search query
    if (!searchQuery.name) {
        return res.render('dashboard', { Users: [] });
    }

    try {
        const data = await User.find({ name: { $regex: new RegExp(searchQuery.name, "i") } });
        console.log("Search Results:", data); // Log the search results
        res.render('dashboard', { Users: data });
    } catch (err) {
        console.log("Error:", err);
        return res.render('dashboard', { Users: [], error: "Error searching users" }); // Render with an error message
    }
};


// Dashboard Logic
const getDashboard = async (req, res) => {
    try {
        const Users = await User.find()
        res.render('dashboard', {
            Users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching dashboard data");
    }
};

module.exports = {
    signup,
    login,
    loadlogin,
    loadsignup,
    getDashboard,
    loadlogout,
    loadadd,
    loadedit,
    loadsearch,
    loaddelete,
    loadupdate,
    addUser,
    getDashboard
}
