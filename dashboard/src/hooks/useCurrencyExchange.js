import { useState, useEffect } from "react";
import { db } from "@/lib/frappeClient";

export default function useCurrencyExchange() {
    const [exchangeRates, setExchangeRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const { message } = await db.getSingleValue("System Settings", "currency")
                const baseCurrency = message || "USD";
                const response = await db.getDocList("Currency Exchange", {
					fields: ["from_currency", "to_currency", "exchange_rate"],
					filters: [
						["from_currency", "=", baseCurrency],
					],
				});
                const rates = {
                    [baseCurrency]: 1,
                };
                response.forEach(rate => {
                    rates[rate.to_currency] = rate.exchange_rate;
                });
                setExchangeRates(rates);
            } catch (error) {
                console.error("Error fetching exchange rates:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchExchangeRates();
    }, []);

    return { exchangeRates, loading, error };
}