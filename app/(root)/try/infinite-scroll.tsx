"use client"
import { InfiniteScroll } from '@/components/infinite-scroll';
import UseFetchOrganizations from '@/hooks/use-fetch-organizations';
import { IOrganization } from '@/types/organization-types';
import { useEffect } from 'react';


export default function ExamplePage() {
  const { organizations, fetchOrganizations} = UseFetchOrganizations()
  
  useEffect(() => {
    fetchOrganizations()
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Scroll Example</h1>
      
      <InfiniteScroll<IOrganization>
        data={organizations}
        renderItem={(post, index) => (
          <div key={post.id} className="p-4 mb-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.name}</h2>
            <p className="text-gray-600">{post.address}</p>
            <p className="text-sm text-gray-400">Item #{index + 1}</p>
          </div>
        )}
        itemsPerPage={10}
        loader={<div className="text-center py-4">Loading more posts...</div>}
        endMessage={<div className="text-center py-4">All posts loaded</div>}
      />
    </div>
  );
}