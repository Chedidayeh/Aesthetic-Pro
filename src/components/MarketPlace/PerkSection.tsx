import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import {
  CheckCircle,
  Headset,
  Pencil,
  Truck,
} from 'lucide-react'

const PerkSection = ()=>{
    const perks = [
        {
          name: 'Fast Printing & Delivery',
          Icon: Truck,
          description:
            'Get your custom prints delivered to your doorstep in record time with our efficient printing and shipping process.',
        },
        {
          name: 'Top-Notch Print Quality',
          Icon: CheckCircle,
          description:
            'We ensure the highest quality for every print.',
        },
        {
          name: 'Customization Freedom',
          Icon: Pencil,
          description:
            'Personalize your prints with our easy-to-use design tools. Create unique products that reflect your style and preferences.',
        },
        {
          name: 'Excellent Customer Support',
          Icon: Headset,
          description:
            'Our dedicated customer support team is here to help you with any questions or issues, ensuring a smooth and satisfying experience.',
        }
      ]

    return (
      <div className='items-center flex justify-center my-4'>
        <section className='border rounded-2xl w-[80%] border-gray-200'>
        <MaxWidthWrapper className='py-4'>
          <div className='grid grid-cols-2 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0'>
            {perks.map((perk) => (
              <div
                key={perk.name}
                className='text-center md:flex md:items-start md:text-left lg:block lg:text-center'>
                <div className='md:flex-shrink-0 flex justify-center'>
                  <div className='h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900'>
                    {<perk.Icon className='w-1/3 h-1/3' />}
                  </div>
                </div>

                <div className='mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium'>
                    {perk.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
          </div>
        </MaxWidthWrapper>
      </section>
      </div>
    )

}

export default PerkSection