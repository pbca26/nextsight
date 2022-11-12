const get = async (url, postData?) => {
  const opts = {};

  if (postData) {
    opts.body = JSON.stringify(postData);
    opts.headers = new Headers();
    opts.headers.append('Content-Type', 'application/json');
    opts.headers.append('Content-Length', opts.body.length);
    opts.method = 'POST';
  }

  const response = await fetch(`${url}`, opts);
  const isJson = response.headers.get('Content-Type').includes('application/json');

  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    //throw new Error(body);
  }

  return body;
};

export default get;