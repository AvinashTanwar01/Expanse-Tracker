import React, { useState } from 'react';
import Input from "../inputs/Input";
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';

const AddExpenseForm = ({ onAddExpense }) => {
    const [income, setIncome] = useState({
        category: '',
        amount: '',
        date: '',
        icon: ''
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)} // Corrected key to "icon"
            />
            <Input
                value={income.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Category"
                placeholder="Rent, Food, etc"
                type="text"
            />
            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="1000"
                type="number"
            />
            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                type="date"
            />
            <div className='flex justify-end mt-6'>
                <button
                    type='button'
                    onClick={() => onAddExpense(income)}
                    className='add-btn add-btn-fill'>
                    Add Expense
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;