import { useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apipath";

export const useUserAuth = () => {
    const {user,updateUser , clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user) return ;

        let isMountetd = true;

        const fetchUserInfo= async ()=>{
            try{
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if(isMountetd && response.data){
                    updateUser(response.data);
                }
            }catch(error){
                console.log("failed to fetch user info",error);
                if(isMountetd){
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return()=>{
            isMountetd = false;
        }
    },[updateUser,clearUser,navigate]);
}

export default useUserAuth;