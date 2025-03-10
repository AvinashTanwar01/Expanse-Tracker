const xlsx = require("xlsx");
const Income = require("../models/Income");

exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount } = req.body;
        if (!source || !amount) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const newIncome = new Income({
            userId,
            icon: icon || "", // Set icon to an empty string if not provided
            source,
            amount,
            date: req.body.date ? new Date(req.body.date) : Date.now() // Use Date.now() if date is not provided
        });

        await newIncome.save();
        res.status(201).json({ newIncome });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const incomes = await Income.find({ userId }).sort({ date: -1 });
        res.json({ incomes });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
 };
exports.deleteIncome = async (req, res) => {
    
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income Deleted Succesfully " });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
 };
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const income= await Income.find({userId}).sort({date: -1});

        const data = income.map((item) => {
            return {
                Date: item.date, // Correct the key to 'date'
                Source: item.source,
                Amount: item.amount
            };
        });
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
        res.setHeader('Content-Disposition', 'attachment; filename=income_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }catch(err){
        res.status(500).json({message: "Server Error"});

    }
 };