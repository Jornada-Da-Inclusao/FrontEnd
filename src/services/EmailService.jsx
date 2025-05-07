export const Posttoken = async (url) => {
  const resposta = await api.post(url);
  return resposta;
}


export const Gettoken = async (url) => {
  const resposta = await api.get(url);
  return resposta;
}