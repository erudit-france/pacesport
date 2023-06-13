import Head from "next/head";
import Layout from "./layout";

export default function Page(props) {
    return (
        <>
            <Head>
                <title>PACE&lsquo;SPORT - Partenariat</title>
            </Head>
            <main className="tw-bg-gradient-to-b tw-from-gray-100 tw-to-white tw-rounded-t-[2rem] tw-relative tw-shadow-inner -tw-mt-7"
                style={{ minHeight: 'calc(100vh - 180px)' }}>
                <section className="tw-px-4 tw-pt-4">
                    
                </section>
            </main>
        </>
    )
}

export async function getServerSideProps(context) {
    const token = context.req.cookies['token']
    let id = context.query.id
    let sponsoringOffer = await fetch(`${process.env.API_URL}/api/sponsoring-offer/${id}`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
    )
    sponsoringOffer = await sponsoringOffer.json();
    
      // // Pass data to the page via props
    return { props: { 
        sponsoringOffer: JSON.parse(sponsoringOffer.data)
    } }
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>{page}</Layout>
    )
  }