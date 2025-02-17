import {$host} from "../index.ts";
import {CurrencySolution} from "../../types/currency-solution.type.ts";

export type FetchInfoResponse = {
	contacts: {
		telegramAccount: string;
		contactEmail: string;
		address: string;
	},
	countries: string[],
	currencySolutions: CurrencySolution[]
} | null;

export const fetchInfo = async (): Promise<FetchInfoResponse> => {
	const {data} = await $host.get(`/site-info/all`);
	return data;
}

export const updateContactData = async (telegramAccount: string, contactEmail: string, address: string, token: string) => {
	const {data} = await $host.post(
		'/site-info/updateContacts',
		{telegramAccount, contactEmail, address},
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const updateCountriesData = async (countries: string[], token: string) => {
	const {data} = await $host.post(
		`/site-info/updateCountries`,
		{countries},
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const updateCurrencySolutionData = async (
	currencySolution: CurrencySolution,
	token: string
) => {
	const {data} = await $host.post(
		'/site-info/updateCurrencySolution',
		{...currencySolution},
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const deleteCurrencySolution = async (id: number, token: string) => {
	const {data} = await $host.delete(
		`/site-info/deleteCurrencySolution/${id}`,
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}