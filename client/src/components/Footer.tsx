import React from 'react';

function Footer() {
  return (
    <footer className="mt-auto py-8 text-center text-gray-400 text-sm">
      <p>
        Built<span className="text-red-400"></span> using{' '}
        <strong className="text-gray-600">React</strong>,{' '}
        <strong className="text-gray-600">GraphQL</strong> &{' '}
        <strong className="text-gray-600">MongoDB</strong>.
      </p>
      <p className="mt-2 text-xs text-gray-300">
        © {new Date().getFullYear()} Nexus Inc. Project by Paulo Cardoso.
      </p>
    </footer>
  );
}

export default Footer;