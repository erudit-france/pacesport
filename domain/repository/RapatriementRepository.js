const fetchApi = async (token, url, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let res = await fetch(`${base}${url}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
    })})
    return await res.json()
}

export const getAll = async (token, local = false) => {
    return fetchApi(token, '/api/rapatriement/all')
}

export const getAllOrder = async (token, local = false) => {
    return fetchApi(token, '/api/order/all')
}