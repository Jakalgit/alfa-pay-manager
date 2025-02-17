import React, {useEffect, useState} from 'react';
import {Button, Container, InputGroup} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import Form from "react-bootstrap/Form";
import {
	deleteCurrencySolution,
	fetchInfo,
	FetchInfoResponse,
	updateContactData,
	updateCountriesData,
	updateCurrencySolutionData
} from "../http/api/infoApi.ts";
import {CurrencySolution} from "../types/currency-solution.type.ts";
import styles from "../styles/pages/Home.module.css"
import Loading from "../components/Loading.tsx";

const Home: React.FC = () => {

	const currencySolutionFields = [
		{
			name: "Currency",
			field: "currency",
		},
		{
			name: "Tariff",
			field: "tariff",
		},
		{
			name: "Min/Max Pay in",
			field: "minMaxPayIn",
		},
		{
			name: "Min/Max Pay out",
			field: "minMaxPayOut",
		},
		{
			name: "Traffic Type",
			field: "trafficType",
		},
		{
			name: "Settlement USDT",
			field: "settlementUSDT",
		},
		{
			name: "Settlement period",
			field: "settlementPeriod",
		},
		{
			name: "Methods",
			field: "methods",
		}
	]

	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState<FetchInfoResponse>(null);

	const [telegramAccount, setTelegramAccount] = useState<string>("");
	const [contactEmail, setContactEmail] = useState<string>("");
	const [address, setAddress] = useState<string>("");

	const [countries, setCountries] = useState<string[]>([]);

	const [currencySolutions, setCurrencySolutions] = useState<CurrencySolution[]>([]);

	const [selectedCurrencySolution, setSelectedCurrencySolution] = useState<CurrencySolution | null>(null);

	const onChangeCountries = (value: string) => {
		setCountries(value.split(' '));
	}

	const onChangeCurrencySolutionField = (id: string | number, value: string, field: keyof CurrencySolution) => {
		setCurrencySolutions(prevState => prevState.map(el => {
			if (el.id === id) {
				return {...el, [field]: value};
			} else {
				return el;
			}
		}));
	}

	const addSolution = () => {
		setCurrencySolutions(prevState => [...prevState, {
			id: `time${Date.now()}`,
			currency: "",
			tariff: "",
			minMaxPayIn: "",
			minMaxPayOut: "",
			trafficType: "",
			settlementUSDT: "",
			settlementPeriod: "",
			methods: "",
		}]);
	}

	const updateContacts = async () => {
		try {
			await updateContactData(
				telegramAccount,
				contactEmail,
				address,
				"",
			);
			await getInfo();
			alert("Contacts saved successfully.");
		} catch (e: any) {
			alert(`Error updating contacts: ${e.response.data.message}`);
		}
	}

	const updateCountries = async () => {
		try {
			await updateCountriesData(
				countries,
				"",
			)
			await getInfo();
			alert("Countries saved successfully.");
		} catch (e: any) {
			alert(`Error updating counties: ${e.response.data.message}`);
		}
	}

	const updateCurrencySolution = async () => {
		if (selectedCurrencySolution) {
			try {
				await updateCurrencySolutionData(
					selectedCurrencySolution,
					""
				);
				await getInfo();
				alert("Currency solution saved successfully.");
			} catch (e: any) {
				alert(`Error updating currency solutions: ${e.response.data.message}`);
			}
		}
	}

	const deleteSelectedCurrencySolution = async () => {
		if (selectedCurrencySolution) {
			if (typeof selectedCurrencySolution.id === "number") {
				await deleteCurrencySolution(
					selectedCurrencySolution.id,
					"",
				);
				await getInfo();
			} else {
				setCurrencySolutions(prevState =>
					prevState.filter(el => el.id !== selectedCurrencySolution.id));
				setSelectedCurrencySolution(null);
			}
		}

	}

	async function getInfo() {
		try {
			const result = await fetchInfo();

			setInfo(result);
			setLoading(false);
		} catch {
			alert(`Network error`);
		}
	}

	useEffect(() => {
		getInfo();
	}, []);

	useEffect(() => {
		if (info?.contacts) {
			setTelegramAccount(info.contacts.telegramAccount);
			setContactEmail(info.contacts.contactEmail);
			setAddress(info.contacts.address);
		}

		if (info?.countries) {
			setCountries(info?.countries);
		}

		if (info?.currencySolutions) {
			setCurrencySolutions(info?.currencySolutions);
			setSelectedCurrencySolution(info?.currencySolutions[0]);
			console.log(info?.currencySolutions)
		}
	}, [info]);

	useEffect(() => {
		const candidate = currencySolutions.find(el => el.id === selectedCurrencySolution?.id)
		if (candidate) {
			setSelectedCurrencySolution(candidate);
		}
	}, [currencySolutions]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div style={{ marginTop: '50px' }}>
			<Container>
				<Accordion defaultActiveKey="0">
					<Accordion.Item eventKey="0">
						<Accordion.Header>Contacts</Accordion.Header>
						<Accordion.Body>
							<Form.Label htmlFor="tg-account">Telegram account</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control
									id="tg-account"
									value={telegramAccount}
									onChange={(e) => setTelegramAccount(e.target.value)}
									placeholder="Telegram account (@...)"
									aria-label="Telegram account"
									aria-describedby="Input for telegram account id"
								/>
							</InputGroup>
							<Form.Label htmlFor="contact-email">Contact email</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control
									id="contact-email"
									value={contactEmail}
									onChange={(e) => setContactEmail(e.target.value)}
									placeholder="Email for communication"
									aria-label="Email for communication"
									aria-describedby="Input for email address"
								/>
							</InputGroup>
							<Form.Label htmlFor="address">Address</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="Company address"
									aria-label="Company address"
									aria-describedby="Input for company address"
								/>
							</InputGroup>
							<Button
								className="ps-4 pe-4"
								variant="primary"
								type="submit"
								onClick={updateContacts}
							>
								Save
							</Button>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Countries</Accordion.Header>
						<Accordion.Body>
							<Form.Label htmlFor="countries">Countries (ISO 3166 alpha-2 codes)</Form.Label>
							<InputGroup className="mb-3">
								<Form.Control
									id="countries"
									value={countries.join(' ')}
									onChange={(e) => onChangeCountries(e.target.value)}
									placeholder="ISO codes separated by space"
									aria-label="ISO codes separated by space"
									aria-describedby="ISO codes separated by space"
								/>
							</InputGroup>
							<Button
								className="ps-4 pe-4"
								variant="primary"
								type="submit"
								onClick={updateCountries}
							>
								Save
							</Button>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>Currency solutions</Accordion.Header>
						<Accordion.Body>
							<Button
								onClick={addSolution}
							>
								Add solution
							</Button>
							<div className={styles.horizontalScrollBlock}>
								<div className={styles.scrollRibbon}>
									{currencySolutions.map((el, i) =>
										<Button
											key={i}
											variant={el.id === selectedCurrencySolution?.id? "primary" : "secondary"}
											onClick={() => setSelectedCurrencySolution(el)}
										>
											{el.currency || '...'}
										</Button>
									)}
								</div>
							</div>
							{selectedCurrencySolution && (
								<>
									<Button
										className="mb-3"
										variant="danger"
										onClick={deleteSelectedCurrencySolution}
									>
										Delete entry ({selectedCurrencySolution.currency})
									</Button>
									<div>
										{currencySolutionFields.map((el, i) =>
											<React.Fragment key={i}>
												<Form.Label htmlFor={el.field}>{el.name}</Form.Label>
												<InputGroup className="mb-3">
													<Form.Control
														value={selectedCurrencySolution[el.field as keyof CurrencySolution] || ''}
														onChange={
															(e) =>
																onChangeCurrencySolutionField(
																	selectedCurrencySolution?.id as string | number,
																	e.target.value,
																	el.field as keyof CurrencySolution
																)
														}
														id={el.field}
														aria-label={el.name}
														aria-describedby={el.name}
													/>
												</InputGroup>
											</React.Fragment>
										)}
									</div>
									<Button
										className="ps-4 pe-4"
										variant="primary"
										type="submit"
										onClick={updateCurrencySolution}
									>
										Save ({selectedCurrencySolution.currency})
									</Button>
								</>
							)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Container>
		</div>
	);
};

export default Home;