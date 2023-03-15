import { getCookie } from 'cookies-next'
import { NextResponse } from 'next/server'

// // This function can be marked `async` if using `await` inside
export function middleware(req) {
// if (req.nextUrl.pathname.startsWith('/inscription/finaliser')) {
//         fetch(`/api/register/check/is-complete`, {
//             headers: new Headers({
//               'JWTAuthorization': `Bearer ${getCookie('token')}`,
//               'Content-Type': 'application/json'
//             })
//         })
//         .then(res => res.json())
//         .then(res => {
//             if (res.data){
//                 if(res.data.isSignupComplete == false) {
//                     return NextResponse.rewrite(new URL('/', req.url))
//                 }
//             }
//         })
//     }
}
