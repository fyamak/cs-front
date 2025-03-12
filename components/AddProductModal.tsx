import React, { useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { postData } from '@/utils/api';


interface Response {
    data: object,
    message: string,
    status: string
}

const AddProductModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void;}) => {
    const [productName, setProductName] = useState('');

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");
    const xIcon = <IconX size={20} />;
    const checkIcon = <IconCheck size={20} />;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await postData(`products`, {name: productName});
            const response : Response = res.data

            if (response.status === "Success") {
                setMessage(response.message)
                setStatus("success");
            } else {
                setMessage(response.message)
                setStatus("error");
            }

            if(res.status == 0){
                onSubmit()
            }

        } catch (error) {
            setStatus("error");
            console.log("Error: ", error)        
        }
        setTimeout(() => setStatus(null), 3000);          
        setProductName('');     
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
            
            {status && (
                <div className="fixed top-28 left-5">
                    <Notification 
                        withCloseButton={false}
                        icon={status === "success" ? <IconCheck size={20} /> : <IconX size={20} />}
                        color={status === "success" ? "teal" : "red"}
                        withBorder title={status === "success" ? "Success" : "Error"}
                    >
                        {message}
                    </Notification>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900">Product Name</label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
