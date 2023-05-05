import Layout from "../layout"

export default function Page(props) {
    console.log('association', props.association)
    return (
        <>
        </>
    )
}

export async function getServerSideProps(context) {
    const id = context.query.id
    const token = context.req.cookies['token']
    const res = await fetch(`${process.env.API_URL}/api/association/get/${id}`, {
      headers: new Headers({
              'JWTAuthorization': `Bearer ${token}`,
      })}
      )
    const data = await res.json()
    
    let cards = await fetch(`${process.env.API_URL}/api/discount-card`, {
        headers: new Headers({
                'JWTAuthorization': `Bearer ${token}`,
        })}
        )
    cards = await cards.json()

    // // Pass data to the page via props
    return { props: { 
      association: JSON.parse(data.data),
      cards: JSON.parse(cards.data)
    } }
  }
  
Page.getLayout = function getLayout(page) {
return (
    <Layout image={false}>{page}</Layout>
)
}