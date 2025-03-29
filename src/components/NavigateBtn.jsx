import { useNavigate } from "react-router";

const NavigateBtn = (props) => {
	const { className, route, text } = props;
	const navigate = useNavigate();

	return (
		<button className={className} onClick={() => navigate(route)}>
			{text}
		</button>
	);
};

export default NavigateBtn;
