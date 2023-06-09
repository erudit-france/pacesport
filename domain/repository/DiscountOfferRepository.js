export const getSponsorDiscountOffers = async (token) => {
    let offers = await fetch(`${process.env.API_URL}/api/discountoffer/sponsor/`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    offers = await offers.json();
    return offers;
}