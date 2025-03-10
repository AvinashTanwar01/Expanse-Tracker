import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({value,onChange,placeholder,label,type}) => {
  const [showpassword,setShowPassword]= useState(false)

  const toggleShowPassword=()=>{
    setShowPassword(!showpassword);
  }
  return (
    <div>
      <label className='text-[13px] text-slate-800'>{label}</label>
      <div className='input-box'>
        <input 
        type={type==='password' ? showpassword ? 'text': 'password': type}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e)}
        className='w-full bg-transparent outline-none'
         />
         {type==='password' && (
          <>
            {showpassword ? (
              <FaRegEyeSlash size={22} className="text-primary cursor-pointer" onClick={()=>toggleShowPassword()} />
            ):(
              <FaRegEye onClick={()=>toggleShowPassword()} className='text-slate-400 cursor-pointer' />
            )}
          </>
         )}
      </div>
    </div>
  )
}

export default Input