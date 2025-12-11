import {useEffect, useState} from "react";
import {createProductBundle} from "@/lib/utils";

const useCreateProductBundle = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBundle = async (new_item, price, items) => {
		setLoading(true);
		setError(null);

		try {
			const result = await createProductBundle(new_item, price, items);
			return result;
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

    return {createBundle, loading, error};
};

export default useCreateProductBundle;