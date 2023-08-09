
const fetchApi = async (token, url, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let res = await fetch(`${base}${url}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
    })})
    return await res.json()
}

export const getAssociationActiveOffers = async (token, associationId, local = false) => {
    return fetchApi(token, `/api/sponsoring-offer-sponsor-active/${associationId}`)
}