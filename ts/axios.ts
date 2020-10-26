const axios = config => {
  if (config.error) {
    return Promise.reject({
      error: 'error in axios',
    });
  } else {
    console.log('axios config', config)
    return Promise.resolve({
      ...config,
      result: config.result,
    });
  }
};

axios.interceptors = {
  request: [],
  response: [],
};

axios.useRequestInterceptor = (resolved?, rejected?) => {
  axios.interceptors.request.push({ resolved, rejected });
};

axios.useResponseInterceptor = (resolved?, rejected?) => {
  axios.interceptors.response.push({ resolved, rejected });
};

axios.run = config => {
  const chain = [
    {
      resolved: axios,
      rejected: undefined,
    },
  ];

  axios.interceptors.request.forEach(interceptor => {
    chain.unshift(interceptor); // unshift前插
  });

  axios.interceptors.response.forEach(interceptor => {
    chain.push(interceptor); // push后插
  });

  let promise = Promise.resolve(config); // axios开始resloved config的Promise

  while (chain.length) {
    const { resolved, rejected } = chain.shift();
    promise = promise.then(resolved, rejected); // 核心promise链挨个串联起来
  }

  return promise;
};

export default axios
