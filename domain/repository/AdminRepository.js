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