
export type CurrencySolution = {
	id: number | string | null;
	currency: string;
	tariff: string;
	minMaxPayIn: string;
	minMaxPayOut: string;
	trafficType: string;
	settlementUSDT: string;
	settlementPeriod: string;
	methods: string;
}