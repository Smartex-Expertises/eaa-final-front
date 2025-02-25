import React from 'react'
import LayoutStudent from '@/layouts/student/LayoutStudent';

export default function Administration() {
  return (
    <div>Administration</div>
  )
}

Administration.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
