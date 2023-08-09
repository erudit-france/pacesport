const fetchApi = async (token, url, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let res = await fetch(`${base}${url}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
    })})
    return await res.json()
}

export const getAssociationSponsorInvitations = async (token, local = false) => {
    return fetchApi(token, '/api/association/user/invitation/all')
}

export const getAssociationInvitationRequest = async (token, local = false) => {
    return fetchApi(token, '/api/association/user/validation-request')
}

export const getCurrentRapatriement = async (token, local = false) => {
    return fetchApi(token, '/api/association/rapatriement/current')
}

export const getAssociations = async (token, local = false) => {
    return fetchApi(token, '/api/association/list')
}

export const getById = async (token, id, local = false) => {
    return fetchApi(token, `/api/association/get/${id}`)
}
