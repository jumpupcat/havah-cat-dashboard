import React from 'react';
import {
	Box,
	Flex,
	Grid,
	Text,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import LineChart from 'components/Charts/LineChart';
import TopDashboad from 'components/My/TopDashboad';
import MiddleDashboard from 'components/My/MiddleDashboard';
import DataDashboard from 'components/My/DataDashboard';
// Data
import { lineChartOptionsDashboard } from 'variables/charts';
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/themeAdmin.js";
import MainPanel from "components/Layout/MainPanel";
import PanelContainer from "components/Layout/PanelContainer";
import PanelContent from "components/Layout/PanelContent";
import DashboardData from 'assets/data/dashboard.json';

export default function Dashboard() {
	const mainPanel = React.createRef();

	return (
		<ChakraProvider theme={theme} resetCss={false}>
			<MainPanel
				ref={mainPanel}
				w={{ base: "100%", xl: "100%" }}
			>
				<PanelContent>
					<PanelContainer>
						<Flex flexDirection='column'>
							<TopDashboad />
							
							<MiddleDashboard />

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
										<LineChart
											lineChartData={DashboardData.chartData}
											lineChartOptions={lineChartOptionsDashboard}
										/>
									</Box>
								</Card>
							</Grid>

							<DataDashboard />
						</Flex>
					</PanelContainer>
				</PanelContent>
			</MainPanel>
		</ChakraProvider>
	);
}
