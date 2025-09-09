/** @type {import('next').NextConfig} */
const nextConfig = {
  // Si vous utilisez un `Image` de next/image, vous devrez peut-être décommenter la ligne suivante
  // images: { unoptimized: true },

  // Ajoutez cette ligne
  output: 'export',
};

module.exports = nextConfig;