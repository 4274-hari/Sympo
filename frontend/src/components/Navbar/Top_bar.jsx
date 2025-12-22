import React from 'react'

const Top_bar = () => {
  return <div className='fixed top-0 w-screen h-20 flex flex-row justify-between'>
    <div className='flex items-center justify-center gap-2  '>
        <img src="/VEC_Logo.ico" alt="college logo" width={80} height={80} />
        <p className='text-white text-start uppercase '>Velammal Engineering <br /> College </p>
    </div>
    <div className='flex flex-row gap-4 px-8 py-2 pt-4  '>

        <img src="/Clg_Patner_Logo/img1.png" alt="patner 1" width={80} height={80}/>
        <img src="/Clg_Patner_Logo/img2.png" alt="patner 2" width={80} height={80} />
        <img src="/Clg_Patner_Logo/img3.png" alt="patner 3" width={80} height={80} />
        <img src="/Clg_Patner_Logo/img4.png" alt="patner 4" width={80} height={80} />
        <img src="/Clg_Patner_Logo/TNEA-Code.png" alt="TNEA code " width={80} height={40} />

    </div>
  </div>
}

export default Top_bar