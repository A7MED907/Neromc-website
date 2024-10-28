import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const port = 3000;

// In-memory user storage
const users = [];
let currentUser = null; // Keep track of the logged-in user

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Ensure the server can access HTML/CSS files

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html'); // تقديم صفحة تسجيل الدخول
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check for existing username
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
            return res.status(400).send("Username already in use!");
        }

        // Check for existing email
        const existingEmail = users.find((user) => user.email === email);
        if (existingEmail) {
            return res.status(400).send("Email already in use!");
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long!");
        }

        // Confirm password
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match!");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, email, password: hashedPassword });
        currentUser = { username, email }; // Set the current user
        res.status(201).send("Registration successful!");
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body; // استخدام username

        // Find user
        const findUser = users.find((user) => user.username === username); // تحقق من وجود المستخدم
        if (!findUser) {
            return res.status(400).send("Incorrect username or password!");
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, findUser.password);
        if (passwordMatch) {
            currentUser = findUser; // تعيين المستخدم الحالي
            res.status(200).send("Login successful!");
        } else {
            res.status(400).send("Incorrect username or password!");
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Logout route
app.post("/logout", (req, res) => {
    currentUser = null; // Clear current user
    res.send("Logged out successfully!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

