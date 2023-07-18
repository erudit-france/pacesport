export const getSponsoringOfferCategories = async (token) => {
    let categories = await fetch(`${process.env.API_URL}/api/category/all`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    categories = await categories.json();
    return categories;
}
