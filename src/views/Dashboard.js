import {
	Box,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Grid,
	SimpleGrid,
	Spacer,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	Td
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import LineChart from 'components/Charts/LineChart';
import IconBox from 'components/Icons/IconBox';
// Icons
import { PersonIcon, GlobeIcon, WalletIcon, RocketIcon } from 'components/Icons/Icons.js';
import React, { useEffect, useState } from 'react';
// Data
import { lineChartOptionsDashboard } from 'variables/charts';
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/themeAdmin.js";
import MainPanel from "components/Layout/MainPanel";
import PanelContainer from "components/Layout/PanelContainer";
import PanelContent from "components/Layout/PanelContent";
import planetData from 'assets/data/planet.json';
import lockData from 'assets/data/lock.json';

export default function Dashboard() {
	const mainPanel = React.createRef();
	const [totalPlanet, setTotalPlanet] = useState(0);
	const [totalHolder, setTotalHolder] = useState(0);
	const [todayHolder, setTodayHolder] = useState(0);
	const [todayPlanet, setTodayPlanet] = useState(0);
	const [personalHolder, setPersonalHolder] = useState(0);
	const [mPlanet, setMPlanet] = useState(0);
	const [vc, setVC] = useState(0);
	const [hvhPrice, setHvhPrice] = useState(0.1);
	const [chartData, setChartData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const miningAmount = 4300000;

	useEffect(() => {
		let holder = {};
		let dashbordData = {};
		let personal = 0;
		let mini = 0;
		let v = 0;
		
		planetData.map(p => {
			const date = new Date(Date.parse(p.date) - (1000 * 60 * (60 * 2 + 9))).toISOString().slice(0, 10); 
			if(!dashbordData[date]) dashbordData[date] = {};

			if(!holder[p.address]) {
				if(dashbordData[date].holder) dashbordData[date].holder++;
				else dashbordData[date].holder = 1;
			}

			if(dashbordData[date].planet) dashbordData[date].planet++;
			else dashbordData[date].planet = 1;

			if(p.id < 45001) {
				if(dashbordData[date].personal) dashbordData[date].personal++;
				else dashbordData[date].personal = 1;

				personal++;
			}

			if(p.id > 50000 && p.id < 100000) {
				if(dashbordData[date].mini) dashbordData[date].mini++;
				else dashbordData[date].mini = 1;

				mini++;
			}
			if(p.id > 100000) v++;
			
			holder[p.address] = 1;
		});
		setTotalPlanet(planetData.length);
		setTotalHolder(Object.keys(holder).length);
		setPersonalHolder(personal);
		setMPlanet(mini);
		setVC(v);

		const today = new Date(Date.parse(new Date()) - (1000 * 60 * (60 * 2 + 9))).toISOString().slice(0, 10);
		if(dashbordData[today]) {
			if(dashbordData[today].holder) setTodayHolder(dashbordData[today].holder);
			if(dashbordData[today].planet) setTodayPlanet(dashbordData[today].planet);
		}

		let chartDataDummy = [
			{ name: 'PLANET', data: [] },
			{ name: 'HOLDER', data: [] }
		];
		let j = 0;
		for(let i=11; i>=0; i--) {
			const keyDate = new Date(Date.parse(new Date()) - (1000 * 60 * (60 * 2 + 9)) - ((1000 * 60 * 60 * 24)* i)).toISOString().slice(0, 10);
			const defaultChartData = { x: keyDate, y: 0 }
			chartDataDummy[0].data[j] = { ...defaultChartData };
			chartDataDummy[1].data[j] = { ...defaultChartData };

			if(dashbordData[keyDate]?.planet) chartDataDummy[0].data[j].y = dashbordData[keyDate].planet;
			if(dashbordData[keyDate]?.holder) chartDataDummy[1].data[j].y = dashbordData[keyDate].holder;

			j++;
		}

		let tableDataDummy = [];
		let dummySumP = 7086;
		let dummySumH = 270;
		let dummySumPH = 184 + 45;
		let dummySumS = miningAmount / dummySumP * dummySumPH - lockData.shift();
		let dummyDate = '2023-01-12';
		do {
			const currentH = dashbordData[dummyDate]?.holder ? dashbordData[dummyDate]?.holder : 0;
			const currentP = dashbordData[dummyDate]?.planet ? dashbordData[dummyDate]?.planet : 0;

			tableDataDummy.push({
				date: dummyDate,
				holders: currentH,
				planet: currentP,
				mining: (miningAmount/dummySumP).toFixed(2),
				totalPlanet: dummySumP,
				totalHolders: dummySumH,
				holderSupply: Math.ceil(dummySumS)
			});

			dummySumH += currentH;
			dummySumP += currentP;

			if(dashbordData[dummyDate]?.personal) dummySumPH += dashbordData[dummyDate].personal;
			if(dashbordData[dummyDate]?.mini) dummySumPH += dashbordData[dummyDate].mini * 0.9;
			
			let lockAmount = lockData.shift();
			if(!lockAmount) lockAmount = 0;
			dummySumS += miningAmount / dummySumP * dummySumPH - lockAmount;

			dummyDate = new Date(Date.parse(dummyDate) + (1000 * 60 * 60 * 24)).toISOString().slice(0, 10);
		} while(dummyDate != new Date(Date.parse(today) + (1000 * 60 * 60 * 24)).toISOString().slice(0, 10));

		setChartData(chartDataDummy);
		setTableData(tableDataDummy);
	}, []);

	const numberFormat = (num) => [num].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	const currentRound = () => Math.floor(personalHolder / 100);

	return (
		<ChakraProvider theme={theme} resetCss={false}>
			<MainPanel
				ref={mainPanel}
				w={{ base: "100%", xl: "100%" }}
			>
				<PanelContent>
					<PanelContainer>
						<Flex flexDirection='column'>
							<SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
								{/* MiniStatistics Card */}
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
													<StatHelpText
														alignSelf='flex-end'
														justifySelf='flex-end'
														m='0px'
														color='green.400'
														fontWeight='bold'
														ps='3px'
														fontSize='md'>
														+{ (todayPlanet / totalPlanet * 100).toFixed(2) }%
													</StatHelpText>
												</Flex>
											</Stat>
											<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
												<GlobeIcon h={'24px'} w={'24px'} color='#fff' />
											</IconBox>
										</Flex>
									</CardBody>
								</Card>
								{/* MiniStatistics Card */}
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
													<StatHelpText
														alignSelf='flex-end'
														justifySelf='flex-end'
														m='0px'
														color='green.400'
														fontWeight='bold'
														ps='3px'
														fontSize='md'>
														+{ (todayHolder / totalHolder * 100).toFixed(2) }%
													</StatHelpText>
												</Flex>
											</Stat>
											<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
												<PersonIcon h={'24px'} w={'24px'} color='#fff' />
											</IconBox>
										</Flex>
									</CardBody>
								</Card>
								{/* MiniStatistics Card */}
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
													<StatHelpText
														alignSelf='flex-end'
														justifySelf='flex-end'
														m='0px'
														color='red.500'
														fontWeight='bold'
														ps='3px'
														fontSize='md'>
														-{ ((1 - (tableData[tableData.length-1]?.mining / tableData[tableData.length-2]?.mining)) * 100).toFixed(2) }%
													</StatHelpText>
												</Flex>
											</Stat>
											<Spacer />
											<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
												<WalletIcon h={'24px'} w={'24px'} color='#fff' />
											</IconBox>
										</Flex>
									</CardBody>
								</Card>
								{/* MiniStatistics Card */}
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
													<StatHelpText
														alignSelf='flex-end'
														justifySelf='flex-end'
														m='0px'
														color='green.400'
														fontWeight='bold'
														ps='3px'
														fontSize='md'>
														+0%
													</StatHelpText>
												</Flex>
											</Stat>
											<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
												<RocketIcon h={'24px'} w={'24px'} color='#fff' />
											</IconBox>
										</Flex>
									</CardBody>
								</Card>
							</SimpleGrid>
							
							<Grid templateColumns={{ sm: '1fr', md: '1fr' }} my='26px' gap='18px'>
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
								{/* Satisfaction Rate */}
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
															HOLDERS
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
								{/* Referral Tracking */}
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
														{ (5000 * (1.007 ** (currentRound() - 1))).toFixed(2) } USDT
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
													{ (5000 * (1.007 ** currentRound())).toFixed(2) } USDT
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

							<Grid
								templateColumns={{ sm: '1fr', lg: '1fr' }}
								maxW={{ sm: '100%', md: '100%' }}
								gap='24px'
								mb='24px'>
								{/* Sales Overview */}
								<Card p='28px 0px 0px 0px'>
									<CardHeader mb='20px' ps='22px'>
										<Flex direction='column' alignSelf='flex-start'>
											<Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
												PLANET & HOLDERS
											</Text>
										</Flex>
									</CardHeader>
									<Box w='100%' minH={{ sm: '300px' }}>
										{
											chartData.length > 0 &&
											<LineChart
												lineChartData={chartData}
												lineChartOptions={lineChartOptionsDashboard}
											/>
										}
									</Box>
								</Card>
							</Grid>

							<Grid templateColumns={{ sm: '1fr' }} gap='24px'>
								{/* Projects */}
								<Card p='16px' overflowX={{ sm: 'scroll', xl: 'hidden' }}>
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
													ps='0px'
													color='gray.400'
													fontFamily='Plus Jakarta Display'
													borderBottomColor='#56577A'>
													DATE
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													NEW PLANET
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													NEW HOLDER
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													MINING PLANET
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													MINING HOLDER
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													MINING AMOUNT
												</Th>
												<Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
													HOLDER SUPPLY
												</Th>
											</Tr>
										</Thead>
										<Tbody>
											{
												tableData.reverse().map(t => (
													<Tr>
														<Td ps='0px' borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ t.date }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ numberFormat(t.planet) }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ numberFormat(t.holders) }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ numberFormat(t.totalPlanet) }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ numberFormat(t.totalHolders) }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
																{ t.mining }
															</Text>
														</Td>
														<Td borderBottomColor='#56577A' >
															<Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
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
						</Flex>
					</PanelContainer>
				</PanelContent>
			</MainPanel>
		</ChakraProvider>
	);
}
