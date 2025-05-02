'use server';

import { postData } from '@/utils/api';
import { cookies } from 'next/headers';

interface Response {
    data: {
        accessToken: string,
        expiration: string,
        refreshToken: string
    }
    message: string,
    status: string
}

export async function loginAction(email: string,password: string) {
    const cookieStore = await cookies();
    
    // const res = await postData("login", {
    //     email: email,
    //     password: password});

    const fetchResponse = await fetch('https://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    });
    
    const res = await fetchResponse.json();


    const response: Response = res.data 
    const responseData = response.data

    if (response.status === "Success")
    {
        if (responseData)
        {
            cookieStore.set('accessToken', responseData.accessToken, { secure: true })
            cookieStore.set('expiration', responseData.expiration, { secure: true })
            cookieStore.set('refreshToken', responseData.accessToken, { secure: true })

            return {message: response.message, status: "success"}
        }
    }

    // return {message: "message", status: "error"}
    return {message: response.message, status: "error"}
}
