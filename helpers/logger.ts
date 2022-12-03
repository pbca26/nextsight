const log = process.env.NODE_ENV === 'development' ? console.warn : () => {};

export default log;