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

/*
export const setStep = async (req, res) => {
	const { songId, newStep } = req.body;
	let newStepAsNumber = Number(newStep);
	if (((newStepAsNumber < step.TO_WATCH) || (newStepAsNumber > step.DONE)) && (newStepAsNumber != step.NOT_SELECTED)) {
		errorMessage.error = 'Invalid step code.';
		return res.status(status.bad).send(errorMessage);
	}
	const query = 'UPDATE song SET step = $1 WHERE id = $2';
	try {
		const { rows } = await dbQuery.query(query, [newStepAsNumber, songId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};
*/

