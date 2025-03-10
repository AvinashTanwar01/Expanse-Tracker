const xlsx = require("xlsx");
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount } = req.body;
        if (!category || !amount) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const newExpense = new Expense({
            userId,
            icon: icon || "", // Set icon to an empty string if not provided
            category,
            amount,
            date: req.body.date ? new Date(req.body.date) : Date.now() // Use Date.now() if date is not provided
        });

        await newExpense.save();
        res.status(201).json({ newExpense });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json({ expense });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        const data = expense.map((item) => {
            return {
                Date: item.date,
                Category: item.category,
                Amount: item.amount
            };
        });
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};