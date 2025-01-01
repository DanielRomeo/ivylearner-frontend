/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['your-domain.com', 's3-alpha-sig.figma.com', 'pexels.com', 'images.pexels.com'],
	},
};

module.exports = nextConfig;
