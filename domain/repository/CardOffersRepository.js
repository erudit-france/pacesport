export const getOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/sponsoring-offer-sponsor`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    offers = await offers.json();
    return offers;
}

export const getActiveOffers = async (token, id, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/sponsoring-offer-sponsor-active/${id}`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPendingOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/sponsoring-offer-sponsor-pending/`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPacesportPendingOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/sponsoring-offer-card-pending-pacesport/`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    offers = await offers.json();
    return offers;
}


export const getCardActiveOffers = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let offers = await fetch(`${base}/api/sponsoring-offer-card-active/`, {
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`,
        })
    }
    )
    offers = await offers.json();
    return offers;
}
