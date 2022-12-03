console.warn('process', process);

const dev = process.env.NODE_ENV !== 'production';
const {NEXT_PUBLIC_DEV_URL, NEXT_PUBLIC_PROD_URL} = process.env;
const serverUrl = `${dev ? NEXT_PUBLIC_DEV_URL : NEXT_PUBLIC_PROD_URL}/api`;

export default serverUrl;