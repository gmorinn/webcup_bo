import { ErrorAPI } from "./types";


const Err = (res: ErrorAPI):string => {
	if (res?.err) {
		switch (true) {
			case res.err.includes("no rows in result set"):
				return "Email ou mot de passe incorrect."
			case res.err.includes("EMAIL_ALREADY_EXIST"):
				return "L'email existe déjà."
			case res.err.includes("unique_violation"):
				return "Une info entré est déjà utilisée."
			case res.err.includes("BAD_ROLE"):
				return "Vous n'êtes pas autorisé à faire ça."
			case res.err.includes("check constraint \"firstnamechk\""):
				return "Erreur sur le prénom."
			case res.err.includes("check constraint \"lastnamechk\""):
				return "Erreur sur le nom de famille."
			case res.err.includes("check constraint \"usernamechk\""):
				return "Erreur sur le nom d'utilisateur."
			default:
				break;
		}
	}

	if (res?.error_code) {
		switch (true) {
            case res.error_code.includes("BAD_ROLE"):
				return "Vous n'êtes pas autorisé à faire ça."
			case res.error_code.includes("EMAIL_ALREADY_EXIST"):
				return "L'email existe déjà."
			case res.error_code.includes("USERNAME_ALREADY_EXIST"):
				return "Le nom d'utilisateur est déjà pris."
			default:
				break;
		}
	}

	if (res?.message) {
		switch (true) {
			// eslint-disable-next-line
			case res.message.includes(`must match the regexp \"\\\\d\"`):
				return "Le mot de passe doit contenir au moins un chiffre."
			case res.message.includes(`Wrong format`):
				return "Ce format n'est pas accepté."
			default:
				break;
		}
	}

	if (res?.name) {
		switch (true) {
			// eslint-disable-next-line
			case res.name.includes(`missing_field`):
				return "Veuillez remplir tous les champs."
			default:
				break;
		}
	}

	return "Une erreur est survenue."
};

export default Err