export const getOffers = async (token) => {
    // let offers = await fetch(`${process.env.API_URL}/api/discountoffer/sponsor/`, {
    //     headers: new Headers({
    //             'JWTAuthorization': `Bearer ${token}`,
    //     })}
    // )
    // offers = await offers.json();
    // return offers;
    return {
        data: [
            {
                title: 'Auchan',
                city: 'Lyon',
                description: '5% de réduction sur les articles ...',
                img: 'https://logo-marque.com/wp-content/uploads/2021/02/Auchan-Logo.png'
            },
            {
                title: 'Décathlon',
                city: 'Lyon',
                description: '5% de réduction sur les articles ...',
                img: 'https://logo-marque.com/wp-content/uploads/2020/12/Decathlon-Embleme.png'
            },
            {
                title: 'Cerise et Potiron',
                city: 'Lyon',
                description: '5% de réduction sur les articles ...',
                img: 'https://www.cerise-et-potiron.fr/wp-content/uploads/2021/06/logo-cp.png'
            }
        ]
    }
}