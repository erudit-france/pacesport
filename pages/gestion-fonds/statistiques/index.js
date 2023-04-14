import { Button, Flex, Text } from "@mantine/core"
import Layout from "../layout"
import Link from "next/link"
import { BsArrowLeft } from "react-icons/bs"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function Page() {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const offersData  = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: labels.map(() => (Math.random() * (24.99 - 2.99)).toFixed(2)),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ],
    };

    console.log('offersData', offersData.data)
    
    const NavHeader = () => (
        <Flex justify='space-between' p={'md'}>
            <Link href={'/gestion-fonds'}><Button variant="filled" size="sm"
                className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
                hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
                radius={'xl'}><BsArrowLeft /></Button></Link>
        </Flex>
    )

    return (
        <>
            <NavHeader />
            <Bar options={options} data={offersData} />
        </>
    )
}

Page.getLayout = function getLayout(page) {
    return (
      <Layout text={'Statistiques'}>{page}</Layout>
    )
}