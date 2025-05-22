"use client"
import { Button, Card, Text } from '@mantine/core';
import { useEffect, useState, useRef } from 'react';

interface User {
  id: number;
  name: string;
}

const generateDummyData = (start: number, count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    name: `User ${start + i + 1}`,
  }));
};

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const initialized = useRef(false)


  const loadMoreUsers = async () => {
    if (loading || page >= 10) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2-second delay
    const newUsers = generateDummyData(page * 10, 10);
    setUsers((prevUsers) => [...prevUsers, ...newUsers]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialized.current) {
        initialized.current = true
        loadMoreUsers();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
        if (
            window.innerHeight +
              Math.max(
                window.pageYOffset,
                document.documentElement.scrollTop,
                document.body.scrollTop
              ) >
            document.documentElement.offsetHeight - 100
          ) {
            if (page < 10 && page > 0) { 
                 loadMoreUsers();
              }
          } else {
            return;
          }

    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loading]);

  return (
    <div>
      {users.map((user) => (
        <Card key={user.id}>
          <Text size="sm" c="dimmed">
            {user.name}    
            </Text>
        </Card>
      ))}


        {loading ? (<>Loading more...</>) : (<Button onClick={loadMoreUsers}>Load more</Button> )}
    </div>
  );
};

export default UserListPage;