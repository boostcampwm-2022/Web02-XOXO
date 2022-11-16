import PostFormDto from './dto/oauth.postform.dto';

export function makeFormData(params: PostFormDto) {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    searchParams.append(key, params[key]);
  });
  return searchParams;
}

export function parseToken(openId: string) {
  const [header, payload, signature] = openId
    .split('.')
    .map((data: string, idx) => {
      if (idx === 2) return data;
      return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    });

  return { header, payload, signature };
}
