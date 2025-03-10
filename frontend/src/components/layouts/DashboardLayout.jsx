import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from './Navbar';
import SideMenu from './SideMenu';
import useUserAuth from '../../hooks/useUserAuth';

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);


    useUserAuth();

    return (
        <div className=''>
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className='flex'>
                    <div className='hidden lg:block'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    <div className='grow mx-5'>
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardLayout;