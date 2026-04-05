const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./infrastructure/database/UserModel");
const Category = require("./infrastructure/database/schemas/CategorySchema");
const Book = require("./infrastructure/database/schemas/BookSchema");
const LearningMaterial = require("./infrastructure/database/schemas/LearningMaterialSchema");

dotenv.config();

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB.");

        // Clear existing data (optional, but good for a deterministic seed)
        console.log("Clearing existing data...");
        await User.deleteMany({ email: { $ne: "admin@booksnest.com" } }); // Keep admin if exists
        await Category.deleteMany({});
        await Book.deleteMany({});
        await LearningMaterial.deleteMany({});

        // 1. Create a Librarian User
        console.log("Seeding librarian user...");
        const hashedPassword = await bcrypt.hash("password123", 10);
        const librarian = await User.create({
            name: "Librarian Admin",
            email: "librarian@booksnest.com",
            password: hashedPassword,
            role: "librarian",
        });

        // 2. Create Categories
        console.log("Seeding categories...");
        const categories = await Category.insertMany([
            { name: "Computer Science", description: "Books on programming, AI, and systems." },
            { name: "Literature", description: "Classic and modern literature from around the world." },
            { name: "Science", description: "Physics, Chemistry, and Biology resources." },
            { name: "History", description: "Historical accounts and archaeological studies." },
            { name: "Mathematics", description: "Calculus, Algebra, and Geometry textbooks." },
        ]);

        const catIds = {
            cs: categories.find(c => c.name === "Computer Science")._id,
            lit: categories.find(c => c.name === "Literature")._id,
            sci: categories.find(c => c.name === "Science")._id,
            hist: categories.find(c => c.name === "History")._id,
        };

        // 3. Create Books
        console.log("Seeding books...");
        await Book.insertMany([
            {
                title: "Introduction to Algorithms",
                author: "Thomas H. Cormen",
                isbn: "978-0262033848",
                type: "book",
                status: "approved",
                uploadedBy: librarian._id,
                categoryId: catIds.cs,
                description: "Commonly used as the standard textbook for algorithms courses, this book provides a comprehensive introduction to the modern study of computer algorithms.",
                coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=400&auto=format&fit=crop",
                totalCopies: 5,
                availableCopies: 5
            },
            {
                title: "Clean Code",
                author: "Robert C. Martin",
                isbn: "978-0132350884",
                type: "book",
                status: "approved",
                uploadedBy: librarian._id,
                categoryId: catIds.cs,
                description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Master the art of clean code.",
                coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400&auto=format&fit=crop",
                totalCopies: 3,
                availableCopies: 3
            },
            {
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                isbn: "978-0743273565",
                type: "book",
                status: "approved",
                uploadedBy: librarian._id,
                categoryId: catIds.lit,
                description: "A novel that explores themes of decadence, idealism, resistance to change, social upheaval, and excess in the Jazz Age.",
                coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
                totalCopies: 10,
                availableCopies: 10
            },
            {
                title: "A Brief History of Time",
                author: "Stephen Hawking",
                isbn: "978-0553380163",
                type: "book",
                status: "approved",
                uploadedBy: librarian._id,
                categoryId: catIds.sci,
                description: "Was there a beginning of time? Could time run backwards? Is the universe boundless? Pioneering physicist Stephen Hawking explores these questions.",
                coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
                totalCopies: 4,
                availableCopies: 4
            },
            {
                title: "Sapiens: A Brief History of Humankind",
                author: "Yuval Noah Harari",
                isbn: "978-0062316097",
                type: "book",
                status: "approved",
                uploadedBy: librarian._id,
                categoryId: catIds.hist,
                description: "Earth is 4.5 billion years old. In just a fraction of that time, one species among countless others has conquered it: us. We are the Humans.",
                coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop",
                totalCopies: 7,
                availableCopies: 7
            }
        ]);

        // 4. Create Learning Materials
        console.log("Seeding learning materials...");
        await LearningMaterial.insertMany([
            {
                title: "Getting Started with React",
                description: "A comprehensive video tutorial for React beginners.",
                contentUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                type: "video",
                category: "Computer Science",
                author: "Mosh Hamedani",
                status: "approved"
            },
            {
                title: "Machine Learning Basics",
                description: "An overview of supervised and unsupervised learning.",
                contentUrl: "https://www.coursera.org/learn/machine-learning",
                type: "video",
                category: "Computer Science",
                author: "Andrew Ng",
                status: "approved"
            },
            {
                title: "The Renaissance Period",
                description: "An article exploring the cultural movement in Europe.",
                contentUrl: "https://www.history.com/topics/renaissance/renaissance",
                type: "audio", // Reusing type for mixed resources as per schema
                category: "History",
                author: "History.com Editors",
                status: "approved"
            }
        ]);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedData();
