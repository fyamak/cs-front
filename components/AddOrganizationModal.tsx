import React, { useState } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react';
import { Notification } from '@mantine/core';
import { postData } from '@/utils/api';


interface Response {
    data: object,
    message: string,
    status: string
}

const AddOrganizationModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void;}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [status, setStatus] = useState<"success" | "error" | null>(null);
    const [message, setMessage] = useState<string>("");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await postData(`api/organization`, {
                name: name,
                email: email,
                phone: phone,
                address : address
            });
            const response : Response = res.data

            if (response.status === "Success") {
                setMessage(response.message)
                setStatus("success");
                onSubmit()
            } else {
                setMessage(response.message)
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
            console.log("Error: ", error)        
        }
        setTimeout(() => setStatus(null), 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/80 flex justify-center items-center z-50">
            
            {status && (
                <div className="fixed top-28 right-5">
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
                <h3 className="text-xl font-bold mb-4">Add New Organization</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900">Name</label>
                        <input
                        type="text"
                        value={name}
                        placeholder='Organization'
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900">Email</label>
                        <input
                            type="email"
                            value={email}
                            placeholder='user@example.com'
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            placeholder='05xx-xxx-xxxx'
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900">Address</label>
                        <input
                            type="text"
                            value={address}
                            placeholder='123 Main St, Springfield, IL 62704'
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg transform transition active:scale-95 hover:bg-blue-600"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg transform transition active:scale-95 hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrganizationModal;
