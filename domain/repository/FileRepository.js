export const upload = async (token, file, local = false) => {
    let base = process.env.API_URL;
    if (local) base = ''
    const formData = new FormData()
    formData.append('file', file)
    let res = await fetch(`/api/file/upload`, {
        method: 'POST',
        type: 'cors',
        headers: new Headers({
            'JWTAuthorization': `Bearer ${token}`
        }),
        body: formData
    })
    res = await res.json();
    return res;
}