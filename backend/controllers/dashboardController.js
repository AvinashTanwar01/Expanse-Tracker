const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
        ]);

        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 60)) }
        }).sort({ date: -1 });

        const incomelast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const last30DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }).sort({ date: -1 });

        const incomelast30Days = last30DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const last60DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 60)) }
        }).sort({ date: -1 });

        const expenseLast60Days = last60DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        const lastTransactions = [
            ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date);

        res.json({
            totalBalance: (totalIncome[0]?.totalIncome || 0) - (totalExpense[0]?.totalExpense || 0),
            totalIncome: totalIncome[0]?.totalIncome || 0,
            totalExpense: totalExpense[0]?.totalExpense || 0,
            last30DaysExpense: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysExpense: {
                total: expenseLast60Days,
                transactions: last60DaysExpenseTransactions
            },
            last30DaysIncome: {
                total: incomelast30Days,
                transactions: last30DaysIncomeTransactions,
            },
            last60DaysIncome: {
                total: incomelast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions, 
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};