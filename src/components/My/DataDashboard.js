import {
	Flex,
	Grid,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	Td
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import DashboardData from 'assets/data/dashboard.json';

export default function DataDashboard() {
    const numberFormat = (num) => [num].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return <Grid templateColumns={{ sm: '1fr' }} gap='24px'>
        <Card p='16px'>
            <CardHeader p='12px 0px 28px 0px'>
                <Flex direction='column'>
                    <Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px'>
                        DATA
                    </Text>
                </Flex>
            </CardHeader>
            <Table variant='simple' color='#fff'>
                <Thead>
                    <Tr my='.8rem' ps='0px'>
                        <Th
                            color='gray.400'
                            fontFamily='Plus Jakarta Display'
                            borderBottomColor='#56577A'
                            textAlign="center"
                        >
                            DATE
                        </Th>
                        <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A' textAlign="center">
                            NEW PLANET
                        </Th>
                        <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A' textAlign="center">
                            NEW HOLDER
                        </Th>
                        <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A' textAlign="center">
                            MINING PLANET
                        </Th>
                        <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A' textAlign="center">
                            MINING AMOUNT
                        </Th>
                        <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A' textAlign="center">
                            PERSONAL SUPPLY
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        [...DashboardData.tableData].reverse().map(t => (
                            <Tr>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { t.date }
                                    </Text>
                                </Td>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { numberFormat(t.planet) }
                                    </Text>
                                </Td>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { numberFormat(t.holders) }
                                    </Text>
                                </Td>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { numberFormat(t.totalPlanet) }
                                    </Text>
                                </Td>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { t.mining }
                                    </Text>
                                </Td>
                                <Td borderBottomColor='#56577A' >
                                    <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem' textAlign="center">
                                        { numberFormat(t.holderSupply) }
                                    </Text>
                                </Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </Card>
    </Grid>
}