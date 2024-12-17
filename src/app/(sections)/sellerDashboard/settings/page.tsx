import { getStoreByUserId, getUser } from '@/actions/actions';
import React from 'react'
import SettingsView from './SettingsView';

const Page = async () => {

                const user = await getUser(); // Fetch user
                if (!user) throw new Error("User not found");
        
                const store = await getStoreByUserId(user.id); // Fetch store by user ID
                if (!store) throw new Error("Store not found");

                
  return (
    <SettingsView store={store} />
  )
}

export default Page
