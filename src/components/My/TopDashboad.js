import { useState } from 'react';
import {
	Flex,
	SimpleGrid,
	Spacer,
	Stat,
	StatLabel,
	StatNumber,
} from '@chakra-ui/react';
import { PersonIcon, GlobeIcon, WalletIcon, RocketIcon } from 'components/Icons/Icons.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import IconBox from 'components/Icons/IconBox';
import DashboardData from 'assets/data/dashboard.json';

export default function TopDashboad() {
    const [hvhPrice, setHvhPrice] = useState(0.1);
    const { 
        totalPlanet,
        totalHolder,
        tableData,
    } = DashboardData;

    const numberFormat = (num) => [num].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    return <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
        <Card>
            <CardBody>
                <Flex flexDirection='row' align='center' justify='center' w='100%'>
                    <Stat me='auto'>
                        <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                            PLANET
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize='lg' color='#fff'>
                                { numberFormat(totalPlanet) }
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
                        <GlobeIcon h={'24px'} w={'24px'} color='#fff' />
                    </IconBox>
                </Flex>
            </CardBody>
        </Card>

        <Card minH='83px'>
            <CardBody>
                <Flex flexDirection='row' align='center' justify='center' w='100%'>
                    <Stat me='auto'>
                        <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                            HOLDERS
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize='lg' color='#fff'>
                                { numberFormat(totalHolder) }
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
                        <PersonIcon h={'24px'} w={'24px'} color='#fff' />
                    </IconBox>
                </Flex>
            </CardBody>
        </Card>

        <Card>
            <CardBody>
                <Flex flexDirection='row' align='center' justify='center' w='100%'>
                    <Stat>
                        <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                            MINING
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize='lg' color='#fff'>
                                { tableData[tableData.length-1]?.mining }
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <Spacer />
                    <IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
                        <WalletIcon h={'24px'} w={'24px'} color='#fff' />
                    </IconBox>
                </Flex>
            </CardBody>
        </Card>

        <Card>
            <CardBody>
                <Flex flexDirection='row' align='center' justify='center' w='100%'>
                    <Stat me='auto'>
                        <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                            PRICE
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize='lg' color='#fff' fontWeight='bold'>
                                ${ hvhPrice.toFixed(2) }
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
                        <RocketIcon h={'24px'} w={'24px'} color='#fff' />
                    </IconBox>
                </Flex>
            </CardBody>
        </Card>
    </SimpleGrid>
}