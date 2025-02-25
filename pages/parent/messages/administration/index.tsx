import React from 'react'
import LayoutParent from '@/layouts/parent/LayoutParent';

export default function Administration() {
  return (
    <div>Administration</div>
  )
}

Administration.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutParent>{page}</LayoutParent>;
};
