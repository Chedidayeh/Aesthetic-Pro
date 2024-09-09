'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface BanUserProps {
  user: User;
}

const BanUser: React.FC<BanUserProps> = ({ user }) => {
  const router = useRouter();

  useEffect(() => {
    if (user.isUserBanned) {
      router.push('/api/auth/logout');
    }
  }, [user, router]);

  return <div></div>;
};

export default BanUser;
