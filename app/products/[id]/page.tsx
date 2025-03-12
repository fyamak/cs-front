import React from 'react'

interface PropsProductById{
    params:{
        id: number
    }
}

const ProductPageById = ({ params }: PropsProductById) => {
  return (
    <div className='p-5'>
        Id: {params.id} 
        <p>
            It can be remove
        </p> 
    </div>
  )
}

export default ProductPageById
