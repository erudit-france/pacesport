export const getUser = async (token, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    let user = await fetch(`${base}/api/user`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    user = await user.json();
    return user;
}