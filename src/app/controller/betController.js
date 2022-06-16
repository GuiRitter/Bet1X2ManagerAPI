import dbQuery from '../db/dev/dbQuery';

import {
	errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('betController');

export const getList = async (req, res) => {
	const { projectId } = req.query;
	const query = 'SELECT project, date_time, home, away, odd, bet, expected_result, actual_result, bet_sum, bet_total, prize_total FROM bet WHERE project = $1 ORDER BY date_time DESC';
	try {
		const { rows } = await dbQuery.query(query, [projectId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		log('getList', { error });
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export const postStart = async (req, res) => {
	const { projectId, dateTime, home, away, expectedResult, odd, bet } = req.body;
	log('postStart', { projectId, dateTime, home, away, expectedResult, odd, bet });
	const query = `INSERT INTO bet (project, date_time, home, away, expected_result, odd, bet, actual_result, bet_sum, bet_total, prize_total)${'\n'
		}SELECT $1, $2, $3, $4, $5, $6, $7, NULL, $7, bet_total + $7, prize_total${'\n'
		}FROM bet${'\n'
		}WHERE project = $1${'\n'
		}ORDER BY date_time DESC${'\n'
		}LIMIT 1${'\n'
		}RETURNING *;`;
	try {
		const result = await dbQuery.query(query, [projectId, dateTime, home, away, expectedResult, odd, bet]);
		const rows = result.rows;
		log('postStart', { result });
		return res.status(status.success).send(rows);
	} catch (error) {
		log('postStart', { error });
		if (error) {
			if (error.message) {
				errorMessage.error = error.message;
			} else if (error.where) {
				errorMessage.error = error.where;
			} else {
				errorMessage.error = error;
			}
		} else {
			errorMessage.error = 'Unknown error.';
		}
		return res.status(status.error).send(errorMessage);
	}
};
