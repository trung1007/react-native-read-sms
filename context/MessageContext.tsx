import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import usePermission from '../hook/usePermision';
import { fetchSMSMessages } from '../hook/useSMS';

const MessageContext = createContext<string | null>(null)

interface MessageProviderProps {
    children: ReactNode
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {

    const { receiveSmsPermission, receivedSmsMessage, receivedSmsPhoneNumber, notifcationPermission } = usePermission()
    const [smsMessage, setSmsMessage] = useState('')

    const getSmsMessage = async () => {
        try {
            const messages = await fetchSMSMessages({ read: 0, maxCount: 1 })
            messages.forEach((message) => {
                console.log('Message body:', message.body);
                setSmsMessage(message.body)
            });
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
      getSmsMessage()
    },[smsMessage])

    return (
        <MessageContext.Provider value={smsMessage}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessageContext=()=>{
    const message = useContext(MessageContext)

    return message
}