import fs from 'fs';
import path from 'path';

const dataStorage = {
	baseDir: path.join(__dirname, '../data'),
	create: (dir, file, data, callback) => {
		fs.open(`${dataStorage.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
			if (!err && fileDescriptor) {
				const stringData = JSON.stringify(data);
				fs.writeFile(fileDescriptor, stringData, _err => {
					if (!_err) {
						fs.close(fileDescriptor, __err => {
							if (!__err) {
								callback(false);
							} else {
								callback('Error closing new file.');
							}
						});
					} else {
						callback('Error writing to new file.');
					}
				});
			} else {
				callback('Could not create new file.');
			}
		});
	},
};

export default dataStorage;
