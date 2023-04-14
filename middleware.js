import { getCookie } from 'cookies-next'
import { NextResponse } from 'next/server'

// // This function can be marked `async` if using `await` inside
export function middleware(req) {

    fetch(`${process.env.API_URL}/api/verify/jwt`, {
        method: 'POST',
        headers: new Headers({
            'JWTAuthorization': `Bearer ${getCookie('token')}`,
        }),
    })
    .then(res => res.json())
    .then(res => {
        console.log('middleware -------------- res', res);
        if (res.code == 401) {
            console.log('-------------- res', res.code);
            req.nextUrl.pathname = '/login'
            return NextResponse.redirect(req.nextUrl)
        }
        return NextResponse.rewrite(req.nextUrl);
    })
    .catch((error) => {
        console.log('middleware -------------- error', error);
        return NextResponse.redirect(new URL('/login', req.url))
    })
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/gestion-fonds/',
        '/sponsoring/'
    ],
}
  
