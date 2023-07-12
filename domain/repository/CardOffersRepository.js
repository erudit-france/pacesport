export const getOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-sponsor/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getActiveOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-sponsor-active/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPendingOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-sponsor-pending/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}

export const getAssociationPacesportPendingOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-card-pending-pacesport/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}


export const getCardActiveOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/sponsoring-offer-card-active/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}
