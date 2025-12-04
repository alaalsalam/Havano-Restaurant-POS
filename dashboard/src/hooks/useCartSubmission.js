import { useState } from "react";
import { toast } from "sonner";

import {
	createTransaction,
	convertQuotationToSalesInvoiceFromCart,
	getDefaultCustomer,
	generate_quotation_json,
	transformCartToItems
} from "@/lib/utils";

export default function useCartSubmission({
	cart,
	transactionType,
	customer,
	orderType,
	activeTableId,
	activeWaiterId,
	customerName,
	activeQuotationId,
	clearCart,
	fetchOrders,
	fetchTableOrders,
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [paymentState, setPaymentState] = useState({
		open: false,
		orderId: null,
		items: [],
		payload: null,
		isExistingTransaction: false,
		transactionDoctype: null,
		transactionName: null,
	});

	const handleSubmitOrder = async () => {
		if (!cart?.length) return;

		// ---------------- QUOTATION FLOW ----------------
		if (transactionType === "Quotation") {
			if (!customer) {
				toast.error("Customer required");
				return;
			}

			setIsSubmitting(true);
			try {
				const items = transformCartToItems(cart);

				if (activeQuotationId) {
					const result = await convertQuotationToSalesInvoiceFromCart(
						activeQuotationId,
						items,
						customer,
						orderType || "Take Away",
						activeTableId || null,
						activeWaiterId || null,
						customerName || customer
					);

					if (result?.success && result?.sales_invoice) {
						setPaymentState({
							open: true,
							items: cart,
							isExistingTransaction: true,
							transactionDoctype: "Sales Invoice",
							transactionName: result.sales_invoice,
						});
					} else {
						throw new Error(result?.message || "Failed to convert quotation");
					}
				} else {
					const result = await createTransaction("Quotation", customer, items);

					if (result?.name) {
						const res = await generate_quotation_json(result.name);
						const blob = new Blob([JSON.stringify(res, null, 2)], {
							type: "text/plain",
						});
						const link = document.createElement("a");
						link.href = URL.createObjectURL(blob);
						link.download = `${result.name}.txt`;
						link.click();

						toast.success("Quotation created");
						clearCart();
						await fetchOrders();
						if (activeTableId) await fetchTableOrders(activeTableId);
					}
				}
			} catch (err) {
				// Log the full result for debugging
				const result = err?.response?.data;
				console.error("Convert quotation failed:", result);
				
				// Build a comprehensive error message
				let errorMessage = result?.message || "Failed to convert quotation";
				if (result?.details) {
					errorMessage += `: ${result.details}`;
				}
				if (result?.error_type) {
					errorMessage += ` (${result.error_type})`;
				}
				
				toast.error("Failed to convert quotation", {
					description: errorMessage,
					duration: 8000, // Longer duration to read the error
				});
				console.error(err);
				toast.error(err.message || "Quotation failed");
			} finally {
				setIsSubmitting(false);
			}

			return;
		}

		// ---------------- SALES INVOICE FLOW ----------------
		setIsSubmitting(true);
		try {
			let selectedCustomer = customer || (await getDefaultCustomer());
			if (!selectedCustomer) {
				toast.error("Customer required");
				return;
			}

			const items = transformCartToItems(cart);

			const invoice = await createTransaction(
				"Sales Invoice",
				selectedCustomer,
				items,
				null,
				orderType || "Take Away",
				activeTableId || null,
				activeWaiterId || null,
				customerName || selectedCustomer
			);

			if (invoice?.name) {
				setPaymentState({
					open: true,
					items: cart,
					isExistingTransaction: true,
					transactionDoctype: "Sales Invoice",
					transactionName: invoice.name,
				});
			} else {
				throw new Error("Invoice creation failed");
			}
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Invoice failed");
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		handleSubmitOrder,
		isSubmitting,
		paymentState,
		setPaymentState,
	};
}
