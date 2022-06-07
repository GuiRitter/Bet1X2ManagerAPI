import dbQuery from '../db/dev/dbQuery';

import {
	errorMessage,
	status
} from '../helper/status';

export const getList = async (req, res) => {
	const { projectId } = req.query;
	const query = 'SELECT project, date_time, host, guest, odd, bet, expected_result, actual_result, bet_total, prize_total FROM bet WHERE project = $1 ORDER BY date_time DESC';
	try {
		const { rows } = await dbQuery.query(query, [projectId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		console.log(`${(new Date()).toISOString()} betController getList`, JSON.stringify(error));
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

