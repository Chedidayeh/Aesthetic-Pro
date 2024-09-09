
import { getUserPreOrderByUserId } from '../upload/actions';
import { getUserPreOrder } from './actions';
import OrderPreview from './OrderPreview';
import { getPlatformForTheWebsite, getUser } from '@/actions/actions';

interface PageProps {
    params: {
      preOrderId: string
    }
  }
const Page = async ({ params }: PageProps) => {

    const { preOrderId } = params

    const user = await getUser()

    

    const preOrder = await getUserPreOrder(preOrderId , user?.id!);

    const platform  = await getPlatformForTheWebsite()



    return  <OrderPreview preOrder={preOrder!} user={user!} platform={platform!} />

 

};

export default Page;
