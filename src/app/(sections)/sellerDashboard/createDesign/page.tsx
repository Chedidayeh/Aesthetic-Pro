
  import React from 'react';

  import { getAllCategories, getPlatformForTheWebsite } from "@/actions/actions"

  import CreateDesignView from "./CreateDesignView";
  
  
  
  

  
  const Page =  async () => {
    

    const platform  = await getPlatformForTheWebsite()
  
  
    return (
  
      <>
      <CreateDesignView  platform={platform!} />
                            
    </>
    
    );
  };
  
  export  default Page ;
  
  