import { getLevelByNumber, getStore, getUser } from '@/actions/actions'
import React from 'react'
import LevelsView from './LevelsView'
import { getAllLevels } from '../../adminDashboard/settings/actions'

const Page = async () => {
  const user = await getUser()
  const store = await getStore(user!.id)
  const storeLevel = await getLevelByNumber(store.level)
  const levels = await getAllLevels()

  return (
    <LevelsView levels={levels} storeLevel={storeLevel} />
  )
}

export default Page
