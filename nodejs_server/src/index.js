import http from 'http';
import lib from './lib/lib';

const server = http.createServer();
console.log(lib.calculateTrip(3000, 5, 2000));
server.listen(3000, () => global.console.log(`Server is listening on port 3000`));
