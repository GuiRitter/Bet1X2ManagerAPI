import dbQuery from '../db/dev/dbQuery';

import {
	errorMessage,
	status
} from '../helper/status';

export const getList = async (req, res) => {
	const query = 'SELECT id, name FROM project ORDER BY name';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};
