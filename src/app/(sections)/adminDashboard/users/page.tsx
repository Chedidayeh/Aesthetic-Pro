import React from 'react'
import UsersView from './UsersView'
import { getAllAffiliatesWithDetails, getUsersByType } from './actions';

const Page = async () => {

    const limit = 5

    const users = await getUsersByType(limit , false)
    const affiliates = await getAllAffiliatesWithDetails(limit , false)


  return (
    <UsersView initialUsers={users} limit={limit} initialAffiliates={affiliates} />
  )
}

export default Page