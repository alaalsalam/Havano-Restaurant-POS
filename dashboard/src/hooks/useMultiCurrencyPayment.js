import { useState } from "react";
import { call } from "@/lib/frappeClient";
import { useCartStore } from "@/stores/useCartStore";
import { getDefaultCustomer } from "@/lib/utils";

function useMultiCurrencyPayment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

    let customer = useCartStore((state) => state.customer);
    

	const submitPayment = async ({ payments }) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			// 🔹 Remove zero / empty payments
			const cleanedPayments = Object.fromEntries(
				Object.entries(payments).filter(([_, amount]) => Number(amount) > 0)
			);

			const res = await call.post("havano_restaurant_pos.api.make_multi_currency_payment", {
				customer,
				payments: cleanedPayments,
			});

			const data = res?.message;

			if (!data?.success) {
				throw new Error(data?.message || "Payment failed");
			}

			setSuccess(true);
			return data;
		} catch (err) {
            console.error("Error in submitPayment:", err);  
			const msg = err?.details || err?.message || err?.response?.message || "Something went wrong";

			setError(msg);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		submitPayment,
		loading,
		error,
		success,
	};
}
export default useMultiCurrencyPayment;