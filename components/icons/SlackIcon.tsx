import React from 'react';

export const SlackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-2.25m0 0a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H9.75m0 0a2.25 2.25 0 012.25-2.25v-1.5a2.25 2.25 0 01-2.25-2.25H7.5m3 15h.008v.008H10.5v-.008zm4.5 0h.008v.008H15v-.008zm-4.5-4.5h.008v.008H10.5v-.008zm4.5 0h.008v.008H15v-.008zm-8.25-4.5h.008v.008H6.75v-.008zm4.5 0h.008v.008H11.25v-.008z"
    />
  </svg>
);