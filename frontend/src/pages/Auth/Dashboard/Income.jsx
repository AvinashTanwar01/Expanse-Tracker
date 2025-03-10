import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import IncomeOverview from '../../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance'; // Corrected import path
import { API_PATHS } from '../../utils/apipath';
import Modal from '../../../components/Modal';
import AddIncomeForm from '../../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../../components/Income/IncomeList';
import DeleteAlert from '../../../components/DeleteAlert';
import useUserAuth from '../../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeletedAlert, setOpenDeletedAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_INCOME}`);

      if (response.data) {
        setIncomeData(response.data.incomes); // Ensure you are accessing the correct property
      }
    } catch (error) {
      console.log("Something Went Wrong ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  const handleAddIncome = async (income) => {
    // Handle adding income
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error('Source is Required');
      return;
    }
    if (!amount || isNaN(amount || Number(amount) <= 0)) {
      toast.error('Amount is Required and should be a valid number');
      return;
    }
    if (!date) {
      toast.error('Date is Required');
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon
      });
      setOpenAddIncomeModal(false);
      toast.success('Income Added Successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.error('Error Adding Income', error.response?.data?.message || error.message);
    }
  };

  const deleteIncome = async (id) => {
    // Handle deleting income
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeletedAlert({ show: false, data: null });
      toast.success('Income Deleted Successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.error('Error Deleting Income', error.response?.data?.message || error.message);
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'income-details.xlsx'); // Correct the file name
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      console.log("Error Downloading Income Details", error);
      toast.error("Failed to download, please try again later");
    }
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              setOpenDeletedAlert({
                show: true,
                data: id
              })
            }}
            onDownload={handleDownloadIncomeDetails} // Ensure this is correctly passed
          />
        </div>
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
        <Modal
          isOpen={openDeletedAlert.show}
          onClose={() => setOpenDeletedAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you Sure you want to delete this Income?"
            onDelete={() => deleteIncome(openDeletedAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;