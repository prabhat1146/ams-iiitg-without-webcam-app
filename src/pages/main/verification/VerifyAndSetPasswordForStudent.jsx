import React, { useState, useEffect } from 'react';
// import jwt from 'jsonwebtoken';
import { fetchData } from '../admin/SetFormData';
import ReactLoading from 'react-loading'

const VerifyAndSetPasswordForStudent = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState();
  const [token, setToken] = useState();
  const [alert, setAlert] = useState();
  const [isLoading,setIsLoading]=useState(false);

  const BASEURL = process.env.REACT_APP_BASEURL
  //   const SECRETKEY=process.env.REACT_APP_SECRETKEY


  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };


  useEffect(() => {
    
    const searchParams = new URLSearchParams(window.location.search);

    // Get a specific parameter value
    const token = searchParams.get('token');
    setToken(token)
   
    const url = `${BASEURL}/verification/decodeToken?token=${token}`
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json()
        }else{
            return []
        }
      })
      .then((res) => {
        if (Array(res).length>0) {
          const email = res.email;
          console.log('email: ',res.email)
          setEmail(email)
        }


      })
      .catch((error) => {
        console.log(error)
      }, [token])


    // Log or use the parameter value as needed
    console.log('token is:', token, email);

  }, [BASEURL, email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setIsLoading(true)
    const url = `${BASEURL}/verification/verifyEmailForStudent?token=${token}`
    fetch(url)
      .then((res) => {
        if (res.ok) {
            return res.json()
        }else{
            return []
        }
      })
      .then((res) => {
        
        if (res?.isEmailVerified) {
          const data = {
            email: email,
            password: password
          }
          console.log('r', data)
          const url = `${BASEURL}/verification/resetPasswordForStudent`
          fetchData(url, data)
            .then((res) => {
              setIsLoading(false);
              if (res) {
                
                setAlert('Congrats! You have verified successfully')
              }else{
                setAlert('Getting an error...')
              }

            })
            .catch((error) => {
              setIsLoading(false)
              setAlert('getting an error to reset the password')
            })

        } else {
          setIsLoading(false);
          if(res.isTokenExpire){
            setAlert('Time limit Exceed! Please  try after some time...')
          }else{
            setAlert('Getting a time-error...')
          }
          
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.log(error)
      })


    // If validation passes, you can proceed with your logic, for example, submit the form.
    // Here, we'll just log the password to the console.
    // console.log('Password submitted:', password);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-500 ">
       <div className='fixed w-full flex justify-center top-24'>
        {
          isLoading && <ReactLoading type='spin' color='blue' />
        }
      </div>
      <h2 className="text-2xl text-white p-8 font-semibold pt-32 mx-auto">Reset password or verify email for Students</h2>
      <h2 className='text-2xl text-white px-8 mb-4 font-semibold'>{alert}</h2>
      <form onSubmit={handleSubmit}>
        <div className=" mx-4 px-4 w-11/12 sm:w-11/12 md:7/12 lg:1/2">
          <label className="block text-white  ">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mx-4 px-4 w-11/12 sm:w-11/12 md:7/12 lg:1/2">
          <label className="block text-white ">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {passwordError && <p className="text-red-500 mx-4 px-4 w-11/12 sm:w-11/12 md:7/12 lg:1/2">{passwordError}</p>}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white mx-4 py-2 mt-2 rounded-md hover:bg-blue-600 focus:outline-none  w-11/12 sm:w-11/12 md:7/12 lg:1/2"
          >
            Submit
          </button>
        </div>
      </form>

     
    </div>
  );
};

export default VerifyAndSetPasswordForStudent;
