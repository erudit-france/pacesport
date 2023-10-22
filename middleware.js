import { getCookie } from 'cookies-next'
import { NextResponse } from 'next/server'

const exclude = [
    '/conditions-generales-vente',
    '/conditions-generales-utilisation',
    '/politique-de-confidentialite',
    '/home'
    //     ,'/login'
]

// // This function can be marked `async` if using `await` inside
export function middleware(req) {

    // console.log('req.nextUrl.pathname', req.nextUrl.pathname)
    if (!exclude.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    } else {

        // if (exclude.includes(req.nextUrl.pathname)) {
        //     console.log('route contained in exlude')
        //     return NextResponse.next();
        // }else{
        fetch(`${process.env.API_URL}/api/verify/jwt`, {
            method: 'POST',
            headers: new Headers({
                'JWTAuthorization': `Bearer ${getCookie('token_v3')}`,
            }),
        })
            .then(res => res.json())
            .then(res => {
                console.log('middleware -------------- res', res);
                if (res.code == 401) {
                    console.log('-------------- res', res.code);
                    req.nextUrl.pathname = '/login'
                    return NextResponse.redirect(req.nextUrl);
                }
                return NextResponse.rewrite(req.nextUrl);
            })
            .catch((error) => {
                console.log('middleware -------------- error', error);
                return NextResponse.redirect(new URL('/login', req.url))
            })
        return NextResponse.next();
        // }
    }
}


// export const config = {
//     matcher: [
//         '/conditions-generales-vente',
//         '/conditions-generales-utilisation',
//         '/politique-de-confidentialite',
//         '/home',
//         '/login'
//     ],
// }

