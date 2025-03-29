import React from "react";
import NavigateBtn from "../components/NavigateBtn";

function Home(props) {
	const { className } = props;
	return (
		<div
			className="hero min-h-screen bg-slate-50"
			style={{
				backgroundImage:
					"url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
			}}
		>
			<div className="hero-overlay"></div>
			<div className="hero-content text-neutral-content text-center">
				<div className="w-[650px]">
					<h1 className="mb-5 text-5xl font-bold">AM SMILES DENTAL CLINIC</h1>
					<p className="mb-5">
						"Your Smile, Our Heart!" <br />
						Experience comprehensive dental care with our expert services:
						Braces | Dental Implants | Scaling | Fillings | Extractions | Oral
						Health Check-ups. Let us take care of your smile—visit AM Smiles
						Dental Clinic today!
					</p>
					<NavigateBtn
						className="btn w-25 shadow-none text-sm font-bold bg-blend-lighten bg-yellow-500 border-slate-950 text-green-900 py-2 px-4 rounded-lg hover:bg-yellow-500 hover:text-slate-950 hover:border-slate-950"
						route="/register"
						text="Join now"
					/>
				</div>
			</div>
		</div>
	);
}

export default Home;
