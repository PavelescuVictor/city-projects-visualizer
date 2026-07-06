import { Search } from "lucide-react";
import "./SearchField.css";
import type { SearchFieldProps } from "./SearchField.types";

const SearchField = (props: SearchFieldProps) => {
	const { value, placeholder, onChange } = props;

	return (
		<label className="search-field">
			<Search size={17} aria-hidden="true" />
			<input
				type="search"
				value={value}
				placeholder={placeholder}
				onChange={event => onChange(event.target.value)}
			/>
		</label>
	);
};

export default SearchField;
