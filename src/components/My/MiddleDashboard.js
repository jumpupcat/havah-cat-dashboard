import {
	Box,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Grid,
	SimpleGrid,
	Stat,
	StatLabel,
	StatNumber,
	Text,
} from '@chakra-ui/react';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import DashboardData from 'assets/data/dashboard.json';

export default function MiddleDashboard() {
    const {
        personalHolder,
        mPlanet,
        vc,
    } = DashboardData;

    const numberFormat = (num) => [num].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const currentRound = () => Math.floor(personalHolder / 100);

    return <Grid templateColumns={{ sm: '1fr', md: '1fr' }} my='26px' gap='18px'>
        {/* Welcome Card */}
        {/* <Card
            p='0px'
            gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
            bgImage={medusa}
            bgSize='cover'
            bgPosition='50%'>
            <CardBody w='100%' h='100%'>
                <Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
                    <Flex flexDirection='column' h='100%' p='22px' minW='60%' lineHeight='1.6'>
                        <Text fontSize='sm' color='gray.400' fontWeight='bold'>
                            Welcome back,
                        </Text>
                        <Text fontSize='28px' color='#fff' fontWeight='bold' mb='18px'>
                            Mark Johnson
                        </Text>
                        <Text fontSize='md' color='gray.400' fontWeight='normal' mb='auto'>
                            Glad to see you again! <br />
                            Ask me anything.
                        </Text>
                        <Spacer />
                        <Flex align='center'>
                            <Button
                                p='0px'
                                variant='no-hover'
                                bg='transparent'
                                my={{ sm: '1.5rem', lg: '0px' }}>
                                <Text
                                    fontSize='sm'
                                    color='#fff'
                                    fontWeight='bold'
                                    cursor='pointer'
                                    transition='all .3s ease'
                                    my={{ sm: '1.5rem', lg: '0px' }}
                                    _hover={{ me: '4px' }}>
                                    Tab to record
                                </Text>
                                <Icon
                                    as={BsArrowRight}
                                    w='20px'
                                    h='20px'
                                    color='#fff'
                                    fontSize='2xl'
                                    transition='all .3s ease'
                                    mx='.3rem'
                                    cursor='pointer'
                                    pt='4px'
                                    _hover={{ transform: 'translateX(20%)' }}
                                />
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </CardBody>
        </Card> */}

        <Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }}>
            <CardHeader mb='24px'>
                <Flex direction='column'>
                    <Text color='#fff' fontSize='lg' fontWeight='bold' mb='4px'>
                        PLANET RATIO
                    </Text>
                </Flex>
            </CardHeader>
            <SimpleGrid columns={{ sm: 1, md: 2 }} spacing='24px'>
                <Card>
                    <CardBody>
                        <Flex flexDirection='row' align='center' justify='center' w='100%'>
                            <Stat me='auto'>
                                <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                                    PERSONAL
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color='#fff'>
                                        { numberFormat(personalHolder) }
                                    </StatNumber>
                                </Flex>
                            </Stat>
                        </Flex>
                    </CardBody>
                </Card>
                <Card minH='83px'>
                    <CardBody>
                        <Flex flexDirection='row' align='center' justify='center' w='100%'>
                            <Stat me='auto'>
                                <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                                    mPLANET
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color='#fff' textAlign='right'>
                                        { numberFormat(mPlanet) }
                                    </StatNumber>
                                </Flex>
                            </Stat>
                        </Flex>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Flex flexDirection='row' align='center' justify='center' w='100%'>
                            <Stat>
                                <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                                    TEAM
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color='#fff'  fontWeight='bold'>
                                        { numberFormat(5000) }
                                    </StatNumber>
                                </Flex>
                            </Stat>
                        </Flex>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Flex flexDirection='row' align='center' justify='center' w='100%'>
                            <Stat me='auto'>
                                <StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
                                    VC
                                </StatLabel>
                                <Flex>
                                    <StatNumber fontSize='lg' color='#fff' fontWeight='bold'>
                                        { numberFormat(vc) }
                                    </StatNumber>
                                </Flex>
                            </Stat>
                        </Flex>
                    </CardBody>
                </Card>
            </SimpleGrid>
        </Card>

        <Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }}>
            <Flex direction='column'>
                <Flex justify='space-between' align='center' mb='40px'>
                    <Text color='#fff' fontSize='lg' fontWeight='bold'>
                        PLANET PRICE
                    </Text>
                </Flex>
                <Flex direction={{ sm: 'column', md: 'row' }}>
                    <Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
                        <Flex
                            direction='column'
                            p='22px'
                            pe={{ sm: '22e', md: '8px', lg: '22px' }}
                            minW={{ sm: '220px', md: '140px', lg: '220px' }}
                            bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
                            borderRadius='20px'
                            mb='20px'>
                            <Text color='gray.400' fontSize='sm' mb='4px'>
                                CURRENT PRICE
                            </Text>
                            <Text color='#fff' fontSize='lg' fontWeight='bold'>
                                { (5000 * (1.007 ** (currentRound() - 1))).toFixed(4) } USDT
                            </Text>
                        </Flex>
                        <Flex
                            direction='column'
                            p='22px'
                            pe={{ sm: '22px', md: '8px', lg: '22px' }}
                            minW={{ sm: '170px', md: '140px', lg: '170px' }}
                            bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
                            borderRadius='20px'>
                            <Text color='gray.400' fontSize='sm' mb='4px'>
                                NEXT PRICE
                            </Text>
                            <Text color='#fff' fontSize='lg' fontWeight='bold'>
                            { (5000 * (1.007 ** currentRound())).toFixed(4) } USDT
                            </Text>
                        </Flex>
                    </Flex>
                    <Box mx={{ sm: 'auto', md: '0px' }}>
                        <CircularProgress
                            size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
                            value={personalHolder % 100}
                            thickness={6}
                            color='#05CD99'
                            variant='vision'>
                            <CircularProgressLabel>
                                <Flex direction='column' justify='center' align='center'>
                                    <Text color='gray.400' fontSize='sm'>
                                        NEXT
                                    </Text>
                                    <Text
                                        color='#fff'
                                        fontSize={{ md: '36px', lg: '50px' }}
                                        fontWeight='bold'
                                        mb='4px'>
                                        { 100 - (personalHolder % 100) }
                                    </Text>
                                    <Text color='gray.400' fontSize='sm'>
                                        SOLD
                                    </Text>
                                </Flex>
                            </CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                </Flex>
            </Flex>
        </Card>
    </Grid>
}