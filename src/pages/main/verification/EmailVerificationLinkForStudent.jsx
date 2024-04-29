import React, { useEffect, useState } from 'react';
import { fetchData } from '../admin/SetFormData';
import { useLocation } from 'react-router-dom';
import ReactLoading from 'react-loading';

function EmailVerificationLinkForStudent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // console.log("rendering")

    useEffect(() => {
        if (location && location.state) {
            if (location.state.email && location.state.name) {
                setEmail(location.state.email);
                setName(location.state.name);
                console.log('Props error.',location.state.email,location.state.name);
            } else {
                console.log('Email and name are required.');
            }
        } else {
            console.log('Props error.');
        }
    }, [location,location.state]);

    useEffect(() => {
        const BASEURL = process.env.REACT_APP_BASEURL;
        const url = `${BASEURL}/verification/SendEmailVerificationLinkForStudent`;


        if (name && email) {
            try {
                setIsLoading(true)
                fetchData(url, { name: name, email: email })
                    .then((res) => {
                        // console.log(res)
                        if (res) {
                            setStatus(res);
                            setIsSent(true);

                        }
                        setIsLoading(false)

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } catch (error) {
                setIsLoading(false)
                console.log(error);
            }
        } else {
            setIsLoading(false)
            console.log('Missing name or email', name, email);
        }
    }, [email, name]); // Add name and email as dependencies

    if (isLoading) {
        return (
            <div className='flex h-screen flex-col justify-center items-center  bg-gradient-to-r from-blue-500 to-purple-500'>
                {isLoading && <ReactLoading type='spin' color='blue' />}
                <p className='text-white'>Sending a verification link on your email-id</p>
                <p className='text-white'>Please wait...</p>
            </div>
        );
    }

    return (
        <div className=''>
            <strong className='font-bold'>{status}</strong>

            {isSent && (
                <div className=' text-white p-8 h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500'>
                    <div>
                        <p className='text-white'>Sending success !</p>

                    </div>
                    <div>
                        <h2>We've sent a verification link to your email address: {email}</h2>
                        <h2>Please check your email and click on the link to verify your account.</h2>
                    </div>
                </div>
            )}

            {!isSent && (
                <div className='h-screen flex flex-col p-8 justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500'>
                    <div>
                        <p className='text-white'>Sending failed !</p>

                    </div>
                    <h2 className='text-white text-lg'>Currenty i am facing an issue with the server</h2>
                    <h2 className='text-white text-lg'>Sorry for the inconvenience caused to you.</h2>
                    <h2 className='text-white text-lg'>We will back to you soon...</h2>
                </div>
            )}
        </div>
    );
}

export default EmailVerificationLinkForStudent;
