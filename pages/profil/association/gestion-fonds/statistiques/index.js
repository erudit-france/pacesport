import { Box, Button, Flex, Space, Text } from "@mantine/core"
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
import { Bar, Line } from "react-chartjs-2";
import { useState } from "react";
import { DateRangePicker } from "@mantine/dates";
import 'dayjs/locale/fr';
import moment from "moment";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const NavHeader = ({href}) => (
  <Flex justify='space-between' p={'md'}>
      <Link href={href}><Button variant="filled" size="sm"
          className="tw-bg-gray-50 tw-text-black tw-border-[1px] tw-border-gray-900
          hover:tw-bg-gray-100 hover:tw-text-black tw-rounded-full" 
          radius={'xl'}><BsArrowLeft /></Button></Link>

  </Flex>
)

const OffersChart = ({start, end}) => {
  const color = 'rgba(193, 175, 175, 0.8)'
  const enumerateDaysBetweenDates = (startDate, endDate) => {
    let date = []
    while(moment(startDate) <= moment(endDate)){
      date.push(moment(startDate).format("DD/MM/YYYY"));
      startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Sponsoring/mecenat',
      },
    },
  };

  const labels = enumerateDaysBetweenDates(start, end);

  const offersData  = {
      labels,
      datasets: [
        {
          label: 'Sponsoring/mecenat',
          data: labels.map(() => (Math.random() * (24.99 - 2.99)).toFixed(2)),
          backgroundColor: color,
        }
      ],
  };
         
  return (
    <Bar options={options} data={offersData} />
  )
}

const CardsChart = ({start, end}) => {
  const color = 'rgba(37, 181, 157, 0.8)'
  const enumerateDaysBetweenDates = (startDate, endDate) => {
    let date = []
    while(moment(startDate) <= moment(endDate)){
      date.push(moment(startDate).format("DD/MM/YYYY"));
      startDate = moment(startDate).add(1, 'days').format("YYYY-MM-DD");
    }
    return date;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Abonnements (€)',
      },
    },
  };

  const labels = enumerateDaysBetweenDates(start, end);

  const offersData  = {
      labels,
      datasets: [
        {
          label: 'Abonnements (€)',
          data: labels.map(() => (Math.random() * (24.99 - 2.99)).toFixed(2)),
          backgroundColor: color,
        }
      ],
  };
         
  return (
    <Bar options={options} data={offersData} />
  )
}

export default function Page(props) {
    const [value, setValue] = useState([
      new Date(2021, 11, 1),
      new Date(2021, 11, 5),
    ]);

    const dateChangeHandler = (val) => {
      if (val[1] != null) {
        setValue([val[0], val[1]])
      }
    }

    return (
        <>
            <NavHeader href={props.previousUrl}/>
            <DateRangePicker
              dropdownType="modal"
              mt={'xs'}
              m={'md'}
              radius={'md'}
              locale="fr"
              label="Date début, Date fin"
              placeholder="Choisir des dates"
              value={value}
              onChange={dateChangeHandler}
            />
            <Box p={'xs'} py={'xl'}>
              {/* <OffersChart start={value[0]} end={value[1]}/> */}
              <Space h={'lg'} my={'lg'}/>
              <CardsChart start={value[0]} end={value[1]}/>
            </Box>
        </>
    )
}


export async function getServerSideProps(context) {
  let url = context.req.headers.referer
  let previousUrl = url === undefined ? '/' : url
  // // Pass data to the page via props
  return { props: { 
  } }
}


Page.getLayout = function getLayout(page) {
    return (
      <Layout text={'Statistiques'}>{page}</Layout>
    )
}