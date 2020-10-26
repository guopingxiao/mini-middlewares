import axios from '../ts/axios'

axios.useRequestInterceptor(config => {
  console.log('request1 config', config)

  return {
    ...config,
    extraParams1: 'extraParams1',
  };
});

axios.useRequestInterceptor(config => {
  console.log('request2 config', config)
  return {
    ...config,
    extraParams2: 'extraParams2',
  };
});

axios.useResponseInterceptor(
  resp => {
    const { extraParams1, extraParams2, result } = resp;
    return `${extraParams1} ${extraParams2} ${result.message}`;
  },
  error => {
    console.log('error', error);
  },
);

(async function() {
  const result = await axios.run({
    result: {
      message: "result1 message",
      code: 200
    }
  });
  console.log('result1: ', result);
})();

(async function() {
  const result = await axios.run({
    error: true,
  });
  console.log('result2: ', result);
})();