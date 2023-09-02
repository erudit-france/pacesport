const fetchApi = async (token, url, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let res = await fetch(`${base}${url}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
    })})
    return await res.json()
}

export const getOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/admin/sponsoring-offer/all`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getActiveOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/admin/sponsoring-offer/active/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPendingOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/admin/sponsoring-offer/pending-association`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPacesportPendingOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/admin/sponsoring-offer/pending-pacesport`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getAllSponsors = async (token, local = false) => {
    return fetchApi(token, '/api/admin/sponsor/all')
}

export const getAllOffers = async (token, local = false) => {
    return fetchApi(token, '/api/admin/sponsoring-offer/all')
}

export const getActiveSponsors = async (token, local = false) => {
    return fetchApi(token, '/api/admin/sponsor/active')
}

export const getPendingSponsors = async (token, local = false) => {
    return fetchApi(token, '/api/admin/sponsor/pending')
}

export const getAllAssociations = async (token, local = false) => {
    return fetchApi(token, '/api/admin/association/all')
}

export const getPendingAssociations = async (token, local = false) => {
    return fetchApi(token, '/api/admin/association/pending')
}

export const getActiveAssociations = async (token, local = false) => {
    return fetchApi(token, '/api/admin/association/active')
}