import { useEffect, useState } from "react";
import { getUserTransactionTypes } from "@/lib/utils";

export default function useTransactionTypes(currentType, setTransactionType) {
	const [availableTypes, setAvailableTypes] = useState(["Sales Invoice", "Quotation"]);

	useEffect(() => {
		const fetchTypes = async () => {
			try {
				const { types, defaultType } = await getUserTransactionTypes();
				setAvailableTypes(types);

				if (defaultType && (!currentType || !types.includes(currentType))) {
					setTransactionType(defaultType);
				}
			} catch (err) {
				console.error("Error loading transaction types:", err);
			}
		};
		fetchTypes();
	}, [currentType, setTransactionType]);

	return availableTypes;
}
