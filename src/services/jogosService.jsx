export const registrarJogo = async (url, dados, setDados, header) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}