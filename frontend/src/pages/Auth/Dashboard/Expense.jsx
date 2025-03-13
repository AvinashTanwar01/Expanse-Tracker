import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import useUserAuth from '../../../hooks/useUserAuth';
import { API_PATHS } from '../../../utils/apipath'; // Corrected import path
import toast from 'react-hot-toast';
import axiosInstance from '../../../utils/axiosinstance'; // Corrected import path
import ExpenseOverview from '../../../components/Expense/ExpenseOverview';
import Modal from '../../../components/Modal';
import AddExpenseForm from '../../../components/Expense/AddExpenseForm';
import ExpenseList from '../../../components/Expense/ExpenseList';
import DeleteAlert from '../../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeletedAlert, setOpenDeletedAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_EXPENSE}`);

      if (response.data && response.data.expense) {
        setExpenseData(response.data.expense); // Ensure you are accessing the correct property
      }
    } catch (error) {
      console.log("Something Went Wrong ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error('Category is Required');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount is Required and should be a valid number');
      return;
    }
    if (!date) {
      toast.error('Date is Required');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      });
      setOpenAddExpenseModal(false);
      toast.success('Expense Added Successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error Adding Expense', error.response?.data?.message || error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeletedAlert({ show: false, data: null });
      toast.success('Expense Deleted Successfully');
      fetchExpenseDetails();
    } catch (error) {
      console.error('Error Deleting Expense', error.response?.data?.message || error.message);
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob'
      });
      console.log("Download Response:", response); // Add this line to verify the response
  
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'expense-details.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      console.log("Error Downloading Expense Details", error);
      toast.error("Failed to download, please try again later");
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
              <ExpenseOverview
                transactions={expenseData}
                onExpenseIncome={() => setOpenAddExpenseModal(true)}
              />
            </div>
            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => {
                setOpenDeletedAlert({
                  show: true,
                  data: id
                });
              }}
              onDownload={handleDownloadExpenseDetails}
            />
          </div>
          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title='Add Expense'
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Modal>
          <Modal
            isOpen={openDeletedAlert.show}
            onClose={() => setOpenDeletedAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense?"
              onDelete={() => deleteExpense(openDeletedAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;